import { apiClient } from "./client";


export async function createCompany(

  name: string,
  companyCode: string

) {
  return await apiClient(
    "/company/create",
    {
      method: "POST",

      body: JSON.stringify({
        name,
        companyCode
      }),
    }
  );
}