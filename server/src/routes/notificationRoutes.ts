import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireCompanyMembership } from "../middleware/authorization.js";
import {
  listMyNotificationsController,
  markNotificationReadController,
} from "../controllers/notificationController.js";

const router = Router();

router.use(authMiddleware, requireCompanyMembership());

router.get("/me", listMyNotificationsController);
router.patch("/:notificationId/read", markNotificationReadController);

export default router;

