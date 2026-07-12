import * as SecureStore from "expo-secure-store";


const TOKEN_KEY = "shiftshare_token";


export async function saveToken(token: string) {

  if (typeof window !== "undefined") {
    localStorage.setItem(
      TOKEN_KEY,
      token
    );
    return;
  }

  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token
  );
}



export async function getToken() {

  if (typeof window !== "undefined") {
    return localStorage.getItem(
      TOKEN_KEY
    );
  }

  return await SecureStore.getItemAsync(
    TOKEN_KEY
  );
}



export async function deleteToken() {

  if (typeof window !== "undefined") {
    localStorage.removeItem(
      TOKEN_KEY
    );
    return;
  }

  await SecureStore.deleteItemAsync(
    TOKEN_KEY
  );
}