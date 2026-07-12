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


interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  loginUser: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}


export const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  loginUser: async () => {},
  logout: async () => {},
});


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    checkToken();

  }, []);



  async function checkToken() {

    try {

      const storedToken = await getToken();

      if (storedToken) {
        setToken(storedToken);
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

  }



  async function logout() {

    await deleteToken();

    setToken(null);

  }



  return (

    <AuthContext.Provider
      value={{
        token,
        isLoading,
        loginUser,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}