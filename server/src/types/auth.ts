import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  role: "employee" | "manager";
  companyId: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

