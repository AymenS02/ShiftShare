import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import Company from "../models/Company.js";

export function requireRole(roles: Array<"employee" | "manager">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}

export function requireCompanyMembership() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.user.companyId) {
      return res.status(400).json({ message: "User is not in a company" });
    }

    next();
  };
}

export async function requireManagerOwnCompany(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Manager role required" });
  }

  if (!req.user.companyId) {
    return res.status(400).json({ message: "Manager has no company" });
  }

  const company = await Company.findById(req.user.companyId).select("managerId");

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  if (company.managerId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}

