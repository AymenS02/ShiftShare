import { listUserNotifications, markNotificationRead, } from "../services/notificationService.js";
export async function listMyNotificationsController(req, res) {
    try {
        const notifications = await listUserNotifications(req.user.id, req.user.companyId);
        res.json(notifications);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function markNotificationReadController(req, res) {
    try {
        const notification = await markNotificationRead(String(req.params.notificationId), req.user.id);
        res.json(notification);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
