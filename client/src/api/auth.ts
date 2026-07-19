import { apiClient } from "./client";

export type UserRole = "employee" | "manager";

export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: UserRole
) {

  return await apiClient("/auth/register", {
    method: "POST",

    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      role,
    }),
  });

}



export async function login(
  email: string,
  password: string
) {
  
  return await apiClient("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });

}



export async function getCurrentUser(){

  return await apiClient("/auth/profile", {
    method:"GET",
  });

}