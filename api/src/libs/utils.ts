import dotenv from "dotenv";
dotenv.config();

export const log = (...message: any[]) => {
  if (process.env.debug === "true") {
    console.log(`[${new Date().toISOString()}]`, ...message);
  }
};
