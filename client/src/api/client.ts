import { getToken } from "../storage/token";


const API_URL = "http://192.168.2.56:5000/api";

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {

  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),

    ...options.headers,
  };


  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );


  const data = await response.json();
  console.log(data.message);

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }


  return data;
}