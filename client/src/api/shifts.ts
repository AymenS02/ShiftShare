import { apiClient } from "./client";

export async function listMyShifts() {
  return await apiClient("/shifts/my", { method: "GET" });
}

export async function listOpenShifts() {
  return await apiClient("/shifts/open", { method: "GET" });
}

export async function claimOpenShift(shiftId: string) {
  return await apiClient(`/shifts/open/${shiftId}/claim`, { method: "POST" });
}

export async function emergencyReleaseShift(shiftId: string) {
  return await apiClient(`/shifts/${shiftId}/emergency-release`, { method: "POST" });
}

export async function listCompanyShifts() {
  return await apiClient("/shifts", { method: "GET" });
}

export async function createShift(payload: {
  employeeId?: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: "scheduled" | "open";
}) {
  return await apiClient("/shifts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function generateSchedule(payload: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}) {
  return await apiClient("/shifts/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

