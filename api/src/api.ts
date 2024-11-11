import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import { connect } from "./database/mongo";
import {
  createUser,
  askToken,
  loginUser,
  getUser,
  editUser,
  deleteUser,
  runRecovery,
  recoverPwd,
  changePwd,
} from "./routes/users";

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

/**
 * Users functions
 */

// Create new user
app.post("/users", createUser);
// Ask for a new email activation
app.post("/users/token", askToken);
// Login user
app.post("/users/login", loginUser);
// Get user info
app.get("/users", getUser);
// Edit user info
app.put("/users", editUser);
// Delete user
app.delete("/users", deleteUser);
// Start password recovery
app.post("/users/run-recovery", runRecovery);
// Recover password
app.post("/users/recover-password", recoverPwd);
// Change password
app.post("/users/change-password", changePwd);

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
