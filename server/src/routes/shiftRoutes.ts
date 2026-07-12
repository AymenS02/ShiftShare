import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  requireCompanyMembership,
  requireManagerOwnCompany,
  requireRole,
} from "../middleware/authorization.js";
import {
  claimShiftController,
  createShiftController,
  emergencyReleaseShiftController,
  generateScheduleController,
  listCompanyShiftsController,
  listMyShiftsController,
  listOpenShiftsController,
  updateShiftController,
} from "../controllers/shiftController.js";

const router = Router();

router.use(authMiddleware, requireCompanyMembership());

router.get("/my", listMyShiftsController);
router.get("/open", listOpenShiftsController);
router.post("/open/:shiftId/claim", requireRole(["employee"]), claimShiftController);
router.post(
  "/:shiftId/emergency-release",
  requireRole(["employee"]),
  emergencyReleaseShiftController
);

router.get("/", requireRole(["manager"]), requireManagerOwnCompany, listCompanyShiftsController);
router.post("/", requireRole(["manager"]), requireManagerOwnCompany, createShiftController);
router.patch(
  "/:shiftId",
  requireRole(["manager"]),
  requireManagerOwnCompany,
  updateShiftController
);
router.post(
  "/generate",
  requireRole(["manager"]),
  requireManagerOwnCompany,
  generateScheduleController
);

export default router;

