import express from "express";
import { Request } from "../database/schemas/requests";
import { v4 as uuidv4 } from "uuid";
import { validateSession } from "../libs/crypto";
import {
  AllowedChains,
  CreateRequestBody,
  RequestStatus,
  validateChain,
  validateNetwork,
} from "./types";
import {
  calculateAmountCrypto,
  checkBitcoinPayment,
  deriveAddress,
  isValidAddress,
} from "../libs/processors/bitcoin";
import { User } from "../database/schemas/users";
import mongoose from "mongoose";
import { log } from "../libs/utils";
export const createRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const user = await validateSession(req);
  const body: CreateRequestBody = req.body;
  // Validate session
  if (user === false) {
    res.send({ message: "Unauthorized.", error: true });
    return;
  }
  // Validate request body
  if (
    !validateChain(body.chain) ||
    !validateNetwork(body.network) ||
    body.amount === undefined
  ) {
    res.send({ message: "Malformed request.", error: true });
    return;
  }
  const checkRequest = await Request.findOne({
    userId: user.id.toString(),
    chain: body.chain,
    network: body.network,
    status: RequestStatus.PENDING,
    amount: body.amount,
  });
  if (checkRequest) {
    res.send({ message: "Request already exists.", error: true });
    return;
  }
  const findLastRequest = await Request.findOne({
    userId: user.id.toString(),
    chain: body.chain,
    network: body.network,
  }).sort({ createdAt: -1 });
  // Get last child number
  let child = 0;
  if (
    findLastRequest &&
    findLastRequest.child !== undefined &&
    findLastRequest.child !== null
  ) {
    child = findLastRequest.child + 1;
  }
  const path = (user.basePath ?? "0") + "/" + child;
  let address: string | false = false;
  if (
    body.chain === AllowedChains.BITCOIN &&
    user.xpub !== undefined &&
    user.xpub !== null &&
    user.xpub !== ""
  ) {
    address = await deriveAddress(user.xpub, path);
  }
  // Be sure address is valid
  if (!address || !isValidAddress(address)) {
    res.send({ message: "Can't derive address.", error: true });
    return;
  }
  // Calculate amount crypto
  const amountCrypto = await calculateAmountCrypto(
    body.amount,
    user.currency ?? "usd",
    user.slippage ?? 2
  );
  if (!amountCrypto) {
    res.send({ message: "Can't calculate amount crypto.", error: true });
    return;
  }
  const request = new Request();
  request.uuid = uuidv4();
  request.userId = user.id.toString();
  request.chain = body.chain;
  request.network = body.network;
  request.identifier = body.identifier ?? "";
  request.path = path;
  request.child = child;
  request.amountFiat = body.amount;
  request.amountCrypto = amountCrypto;
  request.currency = user.currency ?? "usd";
  request.status = RequestStatus.PENDING;
  request.createdAt = Date.now();
  request.address = address;
  await request.save();
  res.send({ message: "Request created.", request, error: false });
};

export const checkRequest = async (
  req: express.Request,
  res: express.Response,
  isDaemon: boolean
) => {
  if (req.params.uuid === undefined) {
    res.send({ message: "Malformed request.", error: true });
    return;
  }
  const request = await Request.findOne({ uuid: req.params.uuid });
  if (!request) {
    res.send({ message: "Request not found.", error: true });
    return;
  }
  const user = await User.findOne({
    _id: new mongoose.Types.ObjectId(request.userId ?? ""),
  });
  if (!user) {
    request.status = RequestStatus.EXPIRED;
    request.updatedAt = Date.now();
    await request.save();
    log("💰 USER_NOT_VALID", request.uuid);
    if (!isDaemon) {
      res.send({ message: "User not valid.", error: true });
    }
    return;
  }
  if (
    request.status !== RequestStatus.PENDING &&
    request.status !== RequestStatus.PARTIAL
  ) {
    res.send({ message: "Request not pending.", request, error: false });
    return;
  }
  let message = "Request is still pending.";
  let fullfillmentPercentage = 0;
  if (
    request.chain === AllowedChains.BITCOIN &&
    request.address &&
    request.amountCrypto
  ) {
    log("💰 Checking bitcoin payment...");
    const check = await checkBitcoinPayment(
      request.address,
      user.onlyConfirmed ?? false
    );
    if (check !== false && check > 0) {
      request.status = RequestStatus.COMPLETED;
      message = "Payment received.";
      request.amountReceived = check;
      fullfillmentPercentage = (check / request.amountCrypto) * 100;
      if (check < request.amountCrypto) {
        request.status = RequestStatus.PARTIAL;
        message = "Payment partially received.";
      }
      request.updatedAt = Date.now();
      await request.save();
    } else if (
      request.createdAt &&
      request.createdAt + 60 * 60 * 1000 < Date.now() // Expiration time 1 hour
    ) {
      request.status = RequestStatus.EXPIRED;
      message = "Payment expired.";
      request.updatedAt = Date.now();
      await request.save();
    }
  }
  if (isDaemon !== true) {
    res.send({ message, request, fullfillmentPercentage, error: false });
  }
};

export const getRequests = async (
  req: express.Request,
  res: express.Response
) => {
  const user = await validateSession(req);
  if (user === false) {
    res.send({ message: "Unauthorized.", error: true });
    return;
  }
  const requests = await Request.find({ userId: user.id.toString() }).sort({
    createdAt: -1,
  });
  res.send({ requests, error: false });
};
