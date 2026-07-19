import { 
  createNativeStackNavigator 
} from "@react-navigation/native-stack";

import { 
  NavigationContainer 
} from "@react-navigation/native";

import { 
  useContext 
} from "react";


import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import CompanySetupScreen from "../screens/CompanySetupScreen";
import CreateCompanyScreen from "../screens/CreateCompanyScreen";
import JoinCompanyScreen from "../screens/JoinCompanyScreen";

import BottomTabs from "./BottomTabs";


import {
  AuthContext
} from "../context/AuthContext";



const Stack =
  createNativeStackNavigator();



export default function AppNavigator() {


  const {
    token,
    user,
    membership,
    isLoading

  } = useContext(AuthContext);


  console.log("AppNavigator: token, user, membership, isLoading", token, user, membership, isLoading);

  if (isLoading) {

    return null;

  }





  function renderScreens() {


    // User is not logged in
    if (!token) {


      return (
        <>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
          />

          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
          />
        </>
      );

    }




    // User is logged in but has no company
    if (!membership) {

      return (
        <>
          <Stack.Screen
            name="CompanySetupScreen"
            component={CompanySetupScreen}
          /> 
          <Stack.Screen
            name="CreateCompanyScreen"
            component={CreateCompanyScreen}
          />
          <Stack.Screen
            name="JoinCompanyScreen"
            component={JoinCompanyScreen}
          />
        </>
      );

    }





        // User has company membership

        return (

          <Stack.Screen
            name="Main"
            component={BottomTabs}
          />

        );


      }





  return (

    <NavigationContainer>


      <Stack.Navigator

        screenOptions={{
          headerShown:false,
        }}

      >

        {renderScreens()}


      </Stack.Navigator>


    </NavigationContainer>

  );

}