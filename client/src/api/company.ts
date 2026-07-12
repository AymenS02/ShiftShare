import { apiClient } from "./client";

export async function createCompany(companyName: string, schedulingSettings: Record<string, number>) {
  return await apiClient("/company", {
    method: "POST",
    body: JSON.stringify({ companyName, schedulingSettings }),
  });
}

export async function joinCompany(companyCode: string) {
  return await apiClient("/company/join", {
    method: "POST",
    body: JSON.stringify({ companyCode }),
  });
}

export async function getMyCompany() {
  return await apiClient("/company/me", { method: "GET" });
}

export async function updateCompany(payload: { companyName?: string; companyCode?: string }) {
  return await apiClient("/company/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function updateCompanySettings(schedulingSettings: Record<string, number>) {
  return await apiClient("/company/me/settings", {
    method: "PATCH",
    body: JSON.stringify({ schedulingSettings }),
  });
}

export async function listCompanyEmployees() {
  return await apiClient("/company/me/employees", { method: "GET" });
}

export async function removeEmployee(employeeId: string) {
  return await apiClient(`/company/me/employees/${employeeId}`, { method: "DELETE" });
}

