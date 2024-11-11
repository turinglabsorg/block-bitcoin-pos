import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { returnSecret } from "./libs/aws";
import axios from "axios";
import { generatePassword } from "./libs/crypto";
import { sendTemplate } from "./libs/mail";
import { email_basic } from "./templates/email_basic";
import { connect } from "./database/mongo";
import { v4 as uuidv4 } from "uuid";

// Init express server
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (e) {
    console.log("😵 Can't connect to MongoDB!");
    res.send({ message: "DB IS NOT WORKING", error: true });
  }
});

// Default response
app.get("/", async function (req, res) {
  res.send({ message: "BLOCKPOS API IS ONLINE", error: false });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

if (process.env.NO_SERVERLESS === undefined) {
  module.exports.handler = serverless(app);
} else {
  const port = process.env.PORT || 8008;
  app.listen(port, () => console.log(`BlockPOS listening on: ${port}`));
}
