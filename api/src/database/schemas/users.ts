import mongoose from "mongoose";
import { Passkey } from "../../libs/types";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
const { Schema } = mongoose;

export interface Product {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  color: "Red" | "Green" | "Blue" | "Yellow" | "Purple";
}

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
  products?: Product[];
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
  products: {
    type: [Schema.Types.Mixed],
    default: [],
  },
});

export const User = mongoose.model("users", userSchema);
