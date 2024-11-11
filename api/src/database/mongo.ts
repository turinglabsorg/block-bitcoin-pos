import { returnSecret } from "../libs/aws";
import mongoose from "mongoose";

export const connect = () => {
  return new Promise(async (response) => {
    try {
      const connection_string = await returnSecret("mongodb_connection");
      if (mongoose.connection.readyState === 0) {
        console.log("💽 Connecting to MongoDB..");
        await mongoose.connect(connection_string);
        console.log("✅ MongoDB connected successfully.");
      }
      response(mongoose);
    } catch (e) {
      response(false);
    }
  });
};
