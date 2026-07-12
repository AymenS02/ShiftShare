import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import {
  createCoverageRequest,
  listCoverageRequestsForUser,
  respondCoverageRequest,
} from "../services/coverageService.js";

export async function createCoverageRequestController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const request = await createCoverageRequest({
      requesterId: req.user!.id,
      companyId: req.user!.companyId!,
      shiftId: req.body.shiftId,
      targetEmployeeId: req.body.targetEmployeeId,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function listCoverageRequestsController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const requests = await listCoverageRequestsForUser(req.user!.id);
    res.json(requests);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function respondCoverageRequestController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const request = await respondCoverageRequest({
      requestId: String(req.params.requestId),
      targetEmployeeId: req.user!.id,
      companyId: req.user!.companyId!,
      action: req.body.action,
    });
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}
