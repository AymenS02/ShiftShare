import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import {
  claimOpenShift,
  createShift,
  generateSchedule,
  listOpenShifts,
  listShifts,
  releaseShiftEmergency,
  updateShift,
} from "../services/shiftService.js";

export async function createShiftController(req: AuthenticatedRequest, res: Response) {
  try {
    const shift = await createShift({
      performedBy: req.user!.id,
      companyId: req.user!.companyId!,
      employeeId: req.body.employeeId,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      status: req.body.status,
    });
    res.status(201).json(shift);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function updateShiftController(req: AuthenticatedRequest, res: Response) {
  try {
    const shift = await updateShift(
      String(req.params.shiftId),
      req.user!.id,
      req.user!.companyId!,
      req.body
    );
    res.json(shift);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function listCompanyShiftsController(req: AuthenticatedRequest, res: Response) {
  try {
    const shifts = await listShifts(req.user!.companyId!);
    res.json(shifts);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function listMyShiftsController(req: AuthenticatedRequest, res: Response) {
  try {
    const shifts = await listShifts(req.user!.companyId!, { mineOnly: req.user!.id });
    res.json(shifts);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function listOpenShiftsController(req: AuthenticatedRequest, res: Response) {
  try {
    const shifts = await listOpenShifts(req.user!.companyId!);
    res.json(shifts);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function generateScheduleController(req: AuthenticatedRequest, res: Response) {
  try {
    const shifts = await generateSchedule({
      managerId: req.user!.id,
      companyId: req.user!.companyId!,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });
    res.json(shifts);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function emergencyReleaseShiftController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const shift = await releaseShiftEmergency(
      String(req.params.shiftId),
      req.user!.id,
      req.user!.companyId!
    );
    res.json(shift);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function claimShiftController(req: AuthenticatedRequest, res: Response) {
  try {
    const shift = await claimOpenShift(
      String(req.params.shiftId),
      req.user!.id,
      req.user!.companyId!
    );
    res.json(shift);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}
