import { apiClient } from "./client";

export async function listMyNotifications() {
  return await apiClient("/notifications/me", { method: "GET" });
}

export async function markNotificationRead(notificationId: string) {
  return await apiClient(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

