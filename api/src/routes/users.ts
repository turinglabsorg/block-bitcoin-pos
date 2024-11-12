import * as express from "express";
import { User } from "../database/schemas/users";
import {
  encrypt,
  hash,
  validateSession,
  validatePassword,
} from "../libs/crypto";
import { returnSecret } from "../libs/crypto";
import { sendMail } from "../libs/mail";
import { getAccountActivationEmail } from "../templates/account-activation";
import { getPasswordRecoveryEmail } from "../templates/password-recovery";
import { EditUserBody, CreateUserBody, LoginUserBody } from "./types";

export async function createUser(req: express.Request, res: express.Response) {
  const body: CreateUserBody = req.body;
  if (body.email !== undefined) {
    try {
      const check = await User.findOne({ email: body.email });

      if (check === null) {
        const token =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        const user = new User({
          email: req.body.email,
          password: "",
          recoveryToken: token,
          recoveryTokenExpiration: new Date().getTime() + 48 * 60 * 60 * 1000, // 48 hours
          active: false,
          slippage: 2,
          lastUpdated: new Date().getTime(),
        });
        await user.save();
        const platform_url = await returnSecret("platform_url");
        const emailContent = getAccountActivationEmail({
          platform_url,
          token,
          email: encodeURIComponent(req.body.email),
        });
        await sendMail(
          user.email,
          "Activate your BlockPOS account",
          emailContent
        );
        res.send({ message: "User created.", error: false });
      } else {
        res.send({ message: "User already exists.", error: true });
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

export async function askToken(req: express.Request, res: express.Response) {
  if (req.body.email !== undefined) {
    const user = await User.findOne({ email: req.body.email });
    if (user !== null) {
      if (
        user.password === "" &&
        user.email !== null &&
        user.email !== undefined
      ) {
        const token =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        user.recoveryToken = token;
        user.recoveryTokenExpiration =
          new Date().getTime() + 48 * 60 * 60 * 1000; // 48 hours
        await user.save();
        const platform_url = await returnSecret("platform_url");
        const emailContent = getAccountActivationEmail({
          platform_url,
          token,
          email: encodeURIComponent(req.body.email),
        });
        await sendMail(
          user.email,
          "Activate your BlockPOS account",
          emailContent
        );
        res.send({ message: "New activation token sent.", error: false });
      } else {
        res.send({ message: "User already activated.", error: true });
      }
    } else {
      res.send({ message: "User not found.", error: true });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function loginUser(req: express.Request, res: express.Response) {
  const body: LoginUserBody = req.body;
  if (body.email !== undefined && body.password !== undefined) {
    try {
      const password = hash(body.password);
      const user = await User.findOne({ email: body.email, password });
      if (user !== null) {
        const jwt = {
          email: user.email,
          loggedAs: new Date().getTime(),
        };
        const encrypted =
          "0x" + (await encrypt(JSON.stringify(jwt))).replace("*", "");
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
        res.send({ message: "User not found.", error: true });
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

export async function runRecovery(req: express.Request, res: express.Response) {
  if (req.body.email !== undefined) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user !== null) {
        const token =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        user.recoveryToken = token;
        user.recoveryTokenExpiration =
          new Date().getTime() + 48 * 60 * 60 * 1000; // 48 hours
        await user.save();
        // Send email
        const platform_url = await returnSecret("platform_url");
        if (user.email !== null && user.email !== undefined) {
          const emailContent = getPasswordRecoveryEmail({
            platform_url,
            token,
            email: encodeURIComponent(user.email),
          });
          await sendMail(
            user.email,
            "Reset your BlockPOS password",
            emailContent
          );
        }
      }
      res.send({ message: "Password recovery process started.", error: false });
    } catch (e) {
      res.send({
        message: "Can't recover password, please retry.",
        error: true,
      });
    }
  }
}

export async function recoverPwd(req: express.Request, res: express.Response) {
  if (
    req.body.email !== undefined &&
    req.body.token !== undefined &&
    req.body.password !== undefined
  ) {
    try {
      const user = await User.findOne({
        email: req.body.email,
        recoveryToken: req.body.token,
      });
      if (user !== null) {
        if (
          user.recoveryTokenExpiration !== undefined &&
          user.recoveryTokenExpiration !== null &&
          user.recoveryTokenExpiration < new Date().getTime()
        ) {
          user.recoveryToken = "";
          user.recoveryTokenExpiration = null;
          await user.save();
          res.send({ message: "Token expired.", error: true });
          return;
        }
        if (!validatePassword(req.body.password)) {
          res.send({
            message: "Password does not meet complexity requirements.",
            error: true,
          });
          return;
        }
        user.password = hash(req.body.password);
        user.recoveryToken = "";
        user.recoveryTokenExpiration = null;
        await user.save();
        res.send({ message: "Password recovered.", error: false });
      } else {
        res.send({ message: "Invalid token.", error: true });
      }
    } catch (e) {
      res.send({
        message: "Can't recover password, please retry.",
        error: true,
      });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}

export async function changePwd(req: express.Request, res: express.Response) {
  if (
    req.body.email !== undefined &&
    req.body.oldPassword !== undefined &&
    req.body.newPassword !== undefined
  ) {
    const user = await validateSession(req);
    if (user === false) {
      res.send({ message: "Unauthorized.", error: true });
      return;
    }
    try {
      if (user.password === hash(req.body.oldPassword)) {
        if (!validatePassword(req.body.newPassword)) {
          res.send({
            message: "Password does not meet complexity requirements.",
            error: true,
          });
          return;
        }
        user.password = hash(req.body.newPassword);
        user.recoveryToken = "";
        user.recoveryTokenExpiration = null;
        user.active = true;
        await user.save();
        res.send({ message: "Password changed.", error: false });
      } else {
        res.send({
          message: "Can't change password, please retry.",
          error: true,
        });
      }
    } catch (e) {
      res.send({
        message: "Can't change password, please retry.",
        error: true,
      });
    }
  } else {
    res.send({ message: "Malformed request.", error: true });
  }
}
