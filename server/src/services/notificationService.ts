import Notification from "../models/Notification.js";

interface CreateNotificationInput {
  userId: string;
  companyId: string;
  type: string;
  message: string;
}

export async function createNotification(input: CreateNotificationInput) {
  return await Notification.create({
    userId: input.userId,
    companyId: input.companyId,
    type: input.type,
    message: input.message,
  });
}

export async function listUserNotifications(userId: string, companyId: string) {
  return await Notification.find({ userId, companyId }).sort({ createdAt: -1 });
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
) {
  const updated = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );

  if (!updated) {
    throw new Error("Notification not found");
  }

  return updated;
}

