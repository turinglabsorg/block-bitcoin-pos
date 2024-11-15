import mongoose from "mongoose";
const { Schema } = mongoose;

export const requestSchema = new Schema({
  uuid: String,
  userId: String,
  identifier: String,
  chain: String,
  network: String,
  path: String,
  child: Number,
  amountFiat: Number,
  amountCrypto: Number,
  amountReceived: Number,
  price: Number,
  currency: String,
  address: String,
  status: String,
  createdAt: Number,
  updatedAt: Number,
});

export const Request = mongoose.model("requests", requestSchema);
