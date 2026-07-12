import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import BottomTabs from "./BottomTabs";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import CreateCompanyScreen from "../screens/CreateCompanyScreen";


const Stack = createNativeStackNavigator();


export default function AppNavigator() {

  const {
    token,
    isLoading
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
          token ? (

            // User is logged in
            <Stack.Screen
              name="Main"
              component={BottomTabs}
            />

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

              <Stack.Screen
                name="CreateCompanyScreen"
                component={CreateCompanyScreen}
              />
            </>

          )
        }


      </Stack.Navigator>

    </NavigationContainer>

  );
}