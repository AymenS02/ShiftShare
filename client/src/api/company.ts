import { apiClient } from "./client";


export async function createCompany(
  name: string
) {
  return await apiClient(
    "/company",
    {
      method: "POST",

      body: JSON.stringify({
        name,
      }),
    }
  );
}