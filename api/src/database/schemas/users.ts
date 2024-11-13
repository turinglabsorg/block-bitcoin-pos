import mongoose from "mongoose";
import { Passkey } from "../../libs/types";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
const { Schema } = mongoose;
export interface UserModel {
  username: string;
  email: string;
  xpub: string;
  currency: string;
  basePath: string;
  onlyConfirmed: boolean;
  recoveryToken: string;
  recoveryTokenExpiration: number;
  metadata: object;
  slippage: number;
  currentRegistrationOptions?: PublicKeyCredentialCreationOptionsJSON | null;
  passkeys: Passkey[];
  lastUpdated: number;
}

export const userSchema = new Schema({
  username: String,
  email: String,
  xpub: String,
  currency: String,
  basePath: String,
  onlyConfirmed: Boolean,
  slippage: Number,
  metadata: Object,
  recoveryToken: String,
  recoveryTokenExpiration: Number,
  currentRegistrationOptions: Object,
  currentAuthenticationOptions: Object,
  passkeys: Array,
  lastUpdated: Number,
});

export const User = mongoose.model("users", userSchema);
