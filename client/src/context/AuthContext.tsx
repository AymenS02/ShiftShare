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

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createCompany as createCompanyAPI,
} from "../api/company";


interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyId?: string | null;
  role?: "employee" | "manager";
}



interface AuthContextType {

  token: string | null;

  user: User | null;

  isLoading: boolean;


  loginUser: (
    token: string,
    user: User
  ) => Promise<void>;


  createCompany: (
    name: string
  ) => Promise<void>;


  logout: () => Promise<void>;

}



export const AuthContext = createContext<AuthContextType>({

  token: null,

  user: null,

  isLoading: true,


  loginUser: async () => {},

  createCompany: async () => {},

  logout: async () => {},

});



export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {


  const [token, setToken] =
    useState<string | null>(null);


  const [user, setUser] =
    useState<User | null>(null);



  const [isLoading, setIsLoading] =
    useState(true);




  useEffect(() => {

    loadAuth();

  }, []);




  async function loadAuth() {

    try {

      const storedToken =
        await getToken();


      const storedUser =
        await AsyncStorage.getItem(
          "user"
        );



      if (storedToken) {

        setToken(storedToken);

      }



      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );

      }


    } catch(error) {


      console.log(
        "Auth loading error:",
        error
      );


    } finally {


      setIsLoading(false);


    }

  }





  async function loginUser(
    newToken:string,
    newUser:User
  ) {


    await saveToken(
      newToken
    );


    await AsyncStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );



    setToken(newToken);

    setUser(newUser);


  }





  async function createCompany(
    name:string
  ) {


    const response =
      await createCompanyAPI(
        name
      );



    const updatedUser = {

      ...user!,

      companyId:
        response.company._id,

    };



    await AsyncStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );


    setUser(updatedUser);


  }






  async function logout() {


    await deleteToken();


    await AsyncStorage.removeItem(
      "user"
    );


    setToken(null);

    setUser(null);


  }





  return (

    <AuthContext.Provider

      value={{

        token,

        user,

        isLoading,

        loginUser,

        createCompany,

        logout,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}