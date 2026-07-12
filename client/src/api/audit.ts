import { apiClient } from "./client";

export async function listAuditLogs() {
  return await apiClient("/audit", { method: "GET" });
}

