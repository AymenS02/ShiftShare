import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  requireCompanyMembership,
  requireManagerOwnCompany,
  requireRole,
} from "../middleware/authorization.js";
import { listAuditLogsController } from "../controllers/auditController.js";

const router = Router();

router.use(authMiddleware, requireRole(["manager"]), requireCompanyMembership(), requireManagerOwnCompany);

router.get("/", listAuditLogsController);

export default router;

