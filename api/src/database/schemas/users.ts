import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
  email: String,
  username: String,
  password: String,
  xpub: String,
  currency: String,
  basePath: String,
  onlyConfirmed: Boolean,
  slippage: Number,
  active: Boolean,
  metadata: Object,
  recoveryToken: String,
  recoveryTokenExpiration: Number,
  lastUpdated: Number,
});

export const User = mongoose.model("users", userSchema);
