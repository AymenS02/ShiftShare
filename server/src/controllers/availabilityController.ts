import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import {
  getAvailabilityPreference,
  upsertAvailabilityPreference,
} from "../services/availabilityService.js";

export async function upsertAvailabilityController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const result = await upsertAvailabilityPreference(
      req.user!.id,
      Boolean(req.body.hasNoUsualShifts),
      req.body.weeklyAvailability ?? {}
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function getMyAvailabilityController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const result = await getAvailabilityPreference(req.user!.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

