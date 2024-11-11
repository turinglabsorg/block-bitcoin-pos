import { returnSecret } from "../libs/aws";
import { log } from "../libs/utils";
import mongoose from "mongoose";

export const connect = () => {
  return new Promise(async (response) => {
    try {
      const connection_string = await returnSecret("mongodb_connection");
      if (mongoose.connection.readyState === 0) {
        log("💽 Connecting to MongoDB..");
        await mongoose.connect(connection_string);
        log("✅ MongoDB connected successfully.");
      }
      response(mongoose);
    } catch (e) {
      response(false);
    }
  });
};
