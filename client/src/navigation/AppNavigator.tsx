import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomTabs from "./BottomTabs";
import CompanySetupScreen from "../screens/CompanySetupScreen";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


const Stack = createNativeStackNavigator();


export default function AppNavigator() {

  const {
    token,
    isLoading,
    user,
  } = useContext(AuthContext);



  if (isLoading) {
    return null;
  }



  return (

    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        {
          token && user ? (

            user.companyId ? (
              <Stack.Screen name="Main">
                {() => <BottomTabs role={user.role} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen
                name="CompanySetup"
                component={CompanySetupScreen}
              />
            )

          ) : (

            // User is not logged in
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

          )
        }


      </Stack.Navigator>

    </NavigationContainer>

  );
}