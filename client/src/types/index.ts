export type UserRole = "employee" | "manager";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyId: string | null;
}

