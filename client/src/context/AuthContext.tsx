import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  getToken,
  saveToken,
  deleteToken,
} from "../storage/token";



interface User {

  id: string;

  firstName: string;

  lastName: string;

  email: string;

  role: "employee" | "manager";

}



interface Membership {

  companyId: string;

  role: "employee" | "manager";

}




interface AuthContextType {

  token: string | null;

  user: User | null;

  membership: Membership | null;

  isLoading: boolean;


  loginUser: (
    token: string,
    user: User,
    membership: Membership | null
  ) => Promise<void>;


  logout: () => Promise<void>;

}




export const AuthContext =
createContext<AuthContextType>({

  token:null,

  user:null,

  membership:null,

  isLoading:true,


  loginUser: async()=>{},

  logout:async()=>{},

});






export function AuthProvider({
  children,
}:{
  children:ReactNode;
}) {



  const [token,setToken]
  =
  useState<string | null>(null);



  const [user,setUser]
  =
  useState<User | null>(null);



  const [membership,setMembership]
  =
  useState<Membership | null>(null);



  const [isLoading,setIsLoading]
  =
  useState(true);





  useEffect(()=>{

    loadAuth();

  },[]);







  async function loadAuth(){


    try{


      const storedToken =
      await getToken();



      const storedUser =
      await AsyncStorage.getItem(
        "user"
      );



      const storedMembership =
      await AsyncStorage.getItem(
        "membership"
      );




      if(storedToken){

        setToken(storedToken);

      }




      if(storedUser){

        setUser(
          JSON.parse(storedUser)
        );

      }





      if(storedMembership){

        setMembership(
          JSON.parse(storedMembership)
        );

      }




    }
    catch(error){

      console.log(
        "Auth loading error",
        error
      );

    }
    finally{

      setIsLoading(false);

    }

  }









  async function loginUser(
    newToken:string,
    newUser:User,
    newMembership:Membership | null
  ){



    await saveToken(
      newToken
    );



    await AsyncStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );



    await AsyncStorage.setItem(
      "membership",
      JSON.stringify(newMembership)
    );



    setToken(newToken);

    setUser(newUser);

    setMembership(newMembership);


  }









  async function logout(){


    await deleteToken();



    await AsyncStorage.removeItem(
      "user"
    );



    await AsyncStorage.removeItem(
      "membership"
    );



    setToken(null);

    setUser(null);

    setMembership(null);


  }







  return (

    <AuthContext.Provider

      value={{

        token,

        user,

        membership,

        isLoading,

        loginUser,

        logout,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}