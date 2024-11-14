import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { connect } from "./database/mongo";
import {
  createOrAskTokenForUser,
  loginUser,
  getUser,
  editUser,
  deleteUser,
  getPublicUser,
  addPasskey,
  verifyPasskey,
  authenticateWithPasskey,
  consumeCredentialResponse,
  removePasskey,
} from "./routes/users";
import { checkRequest, createRequest, getRequests } from "./routes/requests";
import { checkRequests } from "./routes/daemons";
import { log } from "./libs/utils";

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
    log("😵 Can't connect to MongoDB!");
    res.send({ message: "DB IS NOT WORKING", error: true });
  }
});

/**
 * Users functions
 */

// Create new user
app.post("/users", createOrAskTokenForUser);
// Login user
app.post("/users/login", loginUser);
// Get user info
app.get("/users", getUser);
// Get public user info
app.get("/users/:username", getPublicUser);
// Edit user info
app.put("/users", editUser);
// Delete user
app.delete("/users", deleteUser);
// Add passkey
app.post("/users/passkeys/add", addPasskey);
// Authenticate with passkey
app.post("/users/passkeys/authenticate", authenticateWithPasskey);
// Verify passkey
app.post("/users/passkeys/verify", verifyPasskey);
// Consume passkey
app.post("/users/passkeys/consume", consumeCredentialResponse);
// Remove passkey
app.delete("/users/passkeys/remove", removePasskey);

/**
 * Requests functions
 */

// Create new request
app.post("/requests", createRequest);
app.get("/requests/:uuid", checkRequest);
app.get("/requests", getRequests);

/**
 * Daemons functions
 */

app.get("/daemons/check-requests", checkRequests);

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
  app.listen(port, () => log(`₿ BlockPOS listening on: ${port}`));
}
