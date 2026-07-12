import { apiClient } from "./client";

export async function listCoverageRequests() {
  return await apiClient("/coverage", { method: "GET" });
}

export async function createCoverageRequest(shiftId: string, targetEmployeeId: string) {
  return await apiClient("/coverage", {
    method: "POST",
    body: JSON.stringify({ shiftId, targetEmployeeId }),
  });
}

export async function respondCoverageRequest(
  requestId: string,
  action: "accepted" | "declined"
) {
  return await apiClient(`/coverage/${requestId}/respond`, {
    method: "POST",
    body: JSON.stringify({ action }),
  });
}

