import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireCompanyMembership, requireRole } from "../middleware/authorization.js";
import {
  getMyAvailabilityController,
  upsertAvailabilityController,
} from "../controllers/availabilityController.js";

const router = Router();

router.use(authMiddleware, requireRole(["employee"]), requireCompanyMembership());

router.get("/me", getMyAvailabilityController);
router.put("/me", upsertAvailabilityController);

export default router;

