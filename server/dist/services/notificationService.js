import Notification from "../models/Notification.js";
export async function createNotification(input) {
    return await Notification.create({
        userId: input.userId,
        companyId: input.companyId,
        type: input.type,
        message: input.message,
    });
}
export async function listUserNotifications(userId, companyId) {
    return await Notification.find({ userId, companyId }).sort({ createdAt: -1 });
}
export async function markNotificationRead(notificationId, userId) {
    const updated = await Notification.findOneAndUpdate({ _id: notificationId, userId }, { read: true }, { new: true });
    if (!updated) {
        throw new Error("Notification not found");
    }
    return updated;
}
