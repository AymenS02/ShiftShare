import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import { listCompanyAuditLogs } from "../services/auditService.js";

export async function listAuditLogsController(req: AuthenticatedRequest, res: Response) {
  try {
    const logs = await listCompanyAuditLogs(req.user!.companyId!);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

