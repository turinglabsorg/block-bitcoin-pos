import mongoose from "mongoose";
const { Schema } = mongoose;

export const userSchema = new Schema({
  email: String,
  password: String,
  xpub: String,
  active: Boolean,
  recoveryToken: String,
  recoveryTokenExpiration: Number,
  lastUpdated: Number,
});

export const User = mongoose.model("users", userSchema);
