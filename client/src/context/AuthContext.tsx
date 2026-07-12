import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  getToken,
  saveToken,
  deleteToken,
} from "../storage/token";
import { getCurrentUser } from "../api/auth";
import { CurrentUser } from "../types";


interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  user: CurrentUser | null;
  loginUser: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  user: null,
  loginUser: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);



  useEffect(() => {

    checkToken();

  }, []);



  async function checkToken() {

    try {

      const storedToken = await getToken();

      if (storedToken) {
        setToken(storedToken);
        const profile = await getCurrentUser();
        setUser(profile);
      }

    } catch (error) {

      console.log("Token loading error:", error);

    } finally {

      setIsLoading(false);

    }

  }



  async function loginUser(newToken: string) {

    await saveToken(newToken);

    setToken(newToken);
    const profile = await getCurrentUser();
    setUser(profile);

  }



  async function logout() {

    await deleteToken();

    setToken(null);
    setUser(null);

  }

  async function refreshUser() {
    if (!token) {
      setUser(null);
      return;
    }
    const profile = await getCurrentUser();
    setUser(profile);
  }



  return (

    <AuthContext.Provider
      value={{
        token,
        isLoading,
        user,
        loginUser,
        logout,
        refreshUser,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}