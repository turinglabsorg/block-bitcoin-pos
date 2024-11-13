import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { UserModel } from "../database/schemas/users";
import dotenv from "dotenv";
import { Passkey } from "./types";

dotenv.config();

const rpName = process.env.rp_name ?? "BlockPOS";
const rpID = process.env.rp_id ?? "blockpos.xyz";
const origin =
  rpID.indexOf("localhost") !== -1 ? `http://${rpID}` : `https://${rpID}`;

const getRegistrationOptionsForUser = async (
  user: UserModel,
  userPasskeys: Passkey[]
): Promise<PublicKeyCredentialCreationOptionsJSON> => {
  return await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.email,
    attestationType: "none",
    excludeCredentials: userPasskeys.map((passkey) => ({
      id: passkey.id,
      transports: passkey.transports,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
      authenticatorAttachment: "platform",
    },
  });
};

const verifyAttestationResponse = async (
  response: any,
  expectedChallenge: string
) => {
  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  return verification;
};

const getAuthenticationOptionsForUser = async (
  user: UserModel
): Promise<PublicKeyCredentialRequestOptionsJSON> => {
  const options: PublicKeyCredentialRequestOptionsJSON =
    await generateAuthenticationOptions({
      rpID,
      allowCredentials: user.passkeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports,
      })),
    });
  return options;
};

const verifyCredentialResponse = async (
  passkey: Passkey,
  response: any,
  expectedChallenge: string
) => {
  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: passkey.id,
        publicKey: new Uint8Array(passkey.publicKey.buffer),
        counter: passkey.counter,
        transports: passkey.transports,
      },
    });
  } catch (error) {
    console.error(error);
    return false;
  }

  return verification;
};

export {
  getRegistrationOptionsForUser,
  verifyAttestationResponse,
  getAuthenticationOptionsForUser,
  verifyCredentialResponse,
};
