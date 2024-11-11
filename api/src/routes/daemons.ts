import express from "express";
import { RequestStatus } from "./types";
import { checkRequest } from "./requests";
import { Request } from "../database/schemas/requests";
let isWorking = false;

export async function checkRequests(
  req: express.Request,
  res: express.Response
) {
  if (isWorking) {
    res.send({ message: "Daemon is already working.", error: true });
  } else {
    isWorking = true;
  }
  // Get requests to check
  const requests = await Request.find({
    status: { $in: [RequestStatus.PENDING, RequestStatus.PARTIAL] },
  }).sort({ createdAt: 1 });
  // Check requests in order of creation
  if (requests.length > 0) {
    for (const request of requests) {
      req.params.uuid = request.uuid;
      await checkRequest(req, {}, true);
    }
  }
  isWorking = false;
  res.send({ message: "Daemon finished.", error: false });
}
