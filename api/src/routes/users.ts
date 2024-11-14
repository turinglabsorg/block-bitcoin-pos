import * as express from "express";
import { User, UserModel } from "../database/schemas/users";
import { encrypt, hash, validateSession } from "../libs/crypto";
import { returnSecret } from "../libs/crypto";
import { sendMail } from "../libs/mail";
import { getAccountActivationEmail } from "../templates/account-activation";
import {
  EditUserBody,
  CreateUserBody,
  LoginUserBody,
  Passkey,
} from "../libs/types";
import {
  getRegistrationOptionsForUser,
  verifyAttestationResponse,
  getAuthenticationOptionsForUser,
  verifyCredentialResponse,
} from "../libs/passkeys";

export async function createOrAskTokenForUser(
  req: express.Request,
  res: express.Response
) {
  const body: CreateUserBody = req.body;
  if (body.email !== undefined) {
    try {
      const check = await User.findOne({ email: body.email });
      const token = Math.floor(100000 + Math.random() * 900000).toString();

      if (check === null) {
        const user = new User({
          username: "",
          email: req.body.email,
          xpub: "",
          currency: "usd",
          basePath: "0",
          onlyConfirmed: false,
          metadata: {},
          slippage: 2,
          passkeys: [],
          recoveryToken: hash(token),
          recoveryTokenExpiration: new Date().getTime(),
          lastUpdated: new Date().getTime(),
        } as UserModel);
        await user.save();
      } else {
        const elapsed = Math.floor(
          (check.recoveryTokenExpiration! - new Date().getTime()) / 1000
        );
        if (elapsed < 30 && elapsed > 0) {
          res.send({
            message: "Not so fast!",
            elapsed,
            error: true,
          });
          return;
        }
        // Save new token
        check.recoveryToken = hash(token);
        check.recoveryTokenExpiration = new Date().getTime() + 30 * 1000;
        await check.save();
      }

      // Send e-mail
      const platform_url = await returnSecret("platform_url");
      const emailContent = getAccountActivationEmail({
        platform_url,
        token,
        email: encodeURIComponent(req.body.email),
      });
      await sendMail(body.email, "Enter to BlockPOS", emailContent);

      res.send({
        message:
          "Please check your e-mail (also your spam folder) to proceed with login.",
        error: false,
      });
    } catch (e) {
      res.send({
        message: "User service is not working, please retry.",
        error: true,
      });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function loginUser(req: express.Request, res: express.Response) {
  const body: LoginUserBody = req.body;
  if (body.email !== undefined && body.token !== undefined) {
    try {
      const user = await User.findOne({
        email: body.email,
        recoveryToken: hash(body.token),
      });
      if (user !== null) {
        const jwt = {
          email: user.email,
          loggedAs: new Date().getTime(),
        };
        const encrypted =
          "0x" + (await encrypt(JSON.stringify(jwt))).replace("*", "");
        user.recoveryToken = "";
        user.recoveryTokenExpiration = 0;
        user.lastUpdated = new Date().getTime();
        await user.save();

        res.send({
          message: "User logged in.",
          error: false,
          session: encrypted,
          user: {
            id: user.id,
            email: user.email,
            xpub: user.xpub,
          },
        });
      } else {
        res.send({ message: "Oh gosh, retry.", error: true });
      }
    } catch (e) {
      res.send({
        message: "Can't login, please retry.",
        reason: e,
        error: true,
      });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function getUser(req: express.Request, res: express.Response) {
  const user = await validateSession(req);
  if (user !== false) {
    res.send({
      error: false,
      user: {
        email: user.email,
        username: user.username,
        xpub: user.xpub,
        currency: user.currency,
        basePath: user.basePath,
        slippage: user.slippage,
        onlyConfirmed: user.onlyConfirmed,
        metadata: user.metadata,
        passkeys: user.passkeys,
      },
    });
  } else {
    res.send({ message: "Unauthorized.", error: true });
  }
}

export async function getPublicUser(
  req: express.Request,
  res: express.Response
) {
  const username = req.params.username;
  const user = await User.findOne({ username });
  if (user !== null && user.username !== undefined) {
    res.send({
      user: {
        username: user.username,
        metadata: user.metadata,
        slippage: user.slippage,
        currency: user.currency,
        onlyConfirmed: user.onlyConfirmed,
      },
      error: false,
    });
  } else {
    res.send({ message: "User not found.", error: true });
  }
}

export async function editUser(req: express.Request, res: express.Response) {
  const body: EditUserBody = req.body;
  if (body.xpub !== undefined) {
    try {
      const user = await validateSession(req);
      if (user === false) {
        res.send({ message: "Unauthorized.", error: true });
        return;
      }
      const check = await User.findOne({ email: req.body.email });
      const checkUsername = await User.findOne({ username: body.username });
      if (
        (check === null || check._id.toString() === user._id.toString()) &&
        (req.body.username === undefined ||
          req.body.username === "" ||
          checkUsername === null ||
          checkUsername._id.toString() === user._id.toString())
      ) {
        user.email = body.email ?? user.email;
        user.xpub = body.xpub ?? user.xpub;
        user.basePath = body.basePath ?? user.basePath ?? "0";
        user.slippage = body.slippage ?? user.slippage ?? 2;
        user.currency = body.currency ?? user.currency ?? "usd";
        user.metadata = body.metadata ?? user.metadata ?? {};
        user.username = body.username ?? user.username ?? "";
        user.onlyConfirmed = body.onlyConfirmed ?? user.onlyConfirmed ?? false;
        await user.save();
        res.send({ message: "User changed.", error: false });
      } else {
        if (
          checkUsername !== null &&
          checkUsername._id.toString() !== user._id.toString()
        ) {
          res.send({ message: "User with same username exists.", error: true });
        } else {
          res.send({ message: "User with same e-mail exists.", error: true });
        }
      }
    } catch (e) {
      res.send({
        message: "User service is not working, please retry.",
        error: true,
      });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function addPasskey(req: express.Request, res: express.Response) {
  try {
    const user = await validateSession(req);
    if (user === false) {
      res.send({ message: "Unauthorized.", error: true });
      return;
    }
    const options = await getRegistrationOptionsForUser(
      user as UserModel,
      user.passkeys
    );
    user.currentRegistrationOptions = options;
    await user.save();
    res.send({
      message: "Passkey generation started.",
      error: false,
      options,
    });
  } catch (e) {
    res.send({
      message: "User service is not working, please retry.",
      error: true,
    });
  }
}

export async function verifyPasskey(
  req: express.Request,
  res: express.Response
) {
  const user = await validateSession(req);
  if (user === false) {
    res.send({ message: "Unauthorized.", error: true });
    return;
  }
  try {
    const verification = await verifyAttestationResponse(
      req.body,
      user.currentRegistrationOptions.challenge
    );
    if (verification && verification.verified) {
      const newPasskey: Passkey = {
        webAuthnUserID: user.currentRegistrationOptions.user.id,
        id: verification.registrationInfo.credential.id,
        publicKey: verification.registrationInfo.credential.publicKey,
        counter: verification.registrationInfo.credential.counter,
        transports: verification.registrationInfo.credential.transports,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
      };
      user.currentRegistrationOptions = null;
      user.passkeys.push(newPasskey);
      await user.save();
      res.send({
        message: "Passkey verified.",
        passkeys: user.passkeys,
        error: false,
      });
    } else {
      res.send({
        message: "Passkey verification failed.",
        error: true,
      });
    }
  } catch (e) {
    console.log("ERROR_WHILE_VERIFYING_PASSKEY", e);
    res.send({
      message: "Passkey verification failed.",
      error: true,
    });
  }
}

export async function removePasskey(
  req: express.Request,
  res: express.Response
) {
  const user = await validateSession(req);
  if (user === false) {
    res.send({ message: "Unauthorized.", error: true });
    return;
  }
  if (req.body.id !== undefined) {
    user.passkeys = user.passkeys.filter((p) => p.id !== req.body.id);
    await user.save();
    res.send({ message: "Passkey removed.", error: false });
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function authenticateWithPasskey(
  req: express.Request,
  res: express.Response
) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.send({ message: "No passkeys registered.", error: true });
      return;
    }
    if (user.passkeys.length === 0) {
      res.send({
        message: "No passkeys to consume.",
        error: true,
      });
      return;
    }
    const options = await getAuthenticationOptionsForUser(user as UserModel);
    user.currentAuthenticationOptions = options;
    await user.save();
    res.send({
      message: "Passkey consumed.",
      options,
      error: false,
    });
  } catch (e) {
    res.send({
      message: "User service is not working, please retry.",
      error: true,
    });
  }
}

export async function consumeCredentialResponse(
  req: express.Request,
  res: express.Response
) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      res.send({ message: "No passkeys registered.", error: true });
      return;
    }
    if (user.passkeys.length === 0) {
      res.send({
        message: "No passkeys to consume.",
        error: true,
      });
      return;
    }
    if (user.currentAuthenticationOptions === null) {
      res.send({
        message: "No authentication options available.",
        error: true,
      });
      return;
    }
    const passkey = user.passkeys.find((p) => p.id === req.body.credential.id);
    if (passkey === undefined) {
      res.send({
        message: "Passkey not found.",
        error: true,
      });
      return;
    }
    // Verify credential response
    const verification = await verifyCredentialResponse(
      passkey,
      req.body.credential,
      user.currentAuthenticationOptions.challenge
    );
    if (verification && verification.verified) {
      // Reset authentication options
      user.currentAuthenticationOptions = null;
      await user.save();
      // Create JWT
      const jwt = {
        email: user.email,
        loggedAs: new Date().getTime(),
      };
      const encrypted =
        "0x" + (await encrypt(JSON.stringify(jwt))).replace("*", "");

      res.send({
        message: "Passkey verified.",
        session: encrypted,
        user: {
          id: user.id,
          email: user.email,
          xpub: user.xpub,
        },
        error: false,
      });
    } else {
      res.send({
        message: "Passkey verification failed.",
        error: true,
      });
    }
  } catch (e) {
    console.log("ERROR_WHILE_CONSUMING_CREDENTIAL_RESPONSE", e);
    res.send({
      message: "User service is not working, please retry.",
      error: true,
    });
  }
}

export async function deleteUser(req: express.Request, res: express.Response) {
  try {
    const user = await validateSession(req);
    if (user === false) {
      res.send({ message: "Unauthorized.", error: true });
      return;
    }
    await User.deleteOne({ _id: user.id });
    res.send({ message: "User deleted.", error: false });
  } catch (e) {
    res.send({
      message: "User service is not working, please retry.",
      error: true,
    });
  }
}
