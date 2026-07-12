import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.js";
import {
  listUserNotifications,
  markNotificationRead,
} from "../services/notificationService.js";

export async function listMyNotificationsController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const notifications = await listUserNotifications(
      req.user!.id,
      req.user!.companyId!
    );
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}

export async function markNotificationReadController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const notification = await markNotificationRead(String(req.params.notificationId), req.user!.id);
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
  }
}
