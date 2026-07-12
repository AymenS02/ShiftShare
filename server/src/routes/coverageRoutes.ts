import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireCompanyMembership, requireRole } from "../middleware/authorization.js";
import {
  createCoverageRequestController,
  listCoverageRequestsController,
  respondCoverageRequestController,
} from "../controllers/coverageController.js";

const router = Router();

router.use(authMiddleware, requireRole(["employee"]), requireCompanyMembership());

router.get("/", listCoverageRequestsController);
router.post("/", createCoverageRequestController);
router.post("/:requestId/respond", respondCoverageRequestController);

export default router;

