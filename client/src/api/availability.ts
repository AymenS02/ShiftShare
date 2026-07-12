import { apiClient } from "./client";

export async function getMyAvailability() {
  return await apiClient("/availability/me", { method: "GET" });
}

export async function saveMyAvailability(payload: {
  hasNoUsualShifts: boolean;
  weeklyAvailability: Record<string, Array<{ startTime: string; endTime: string }>>;
}) {
  return await apiClient("/availability/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

