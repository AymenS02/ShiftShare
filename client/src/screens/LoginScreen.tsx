import React, {
  useState,
  useContext,
} from "react";

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import { login } from "../api/auth";

import { AuthContext } from "../context/AuthContext";

import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const { loginUser } = useContext(AuthContext);

  const navigation = useNavigation();

  async function handleLogin() {
    
    if (!email || !password) {
      
      Alert.alert(
        "Error",
        "Please fill all fields"
      );

      return;

    }


    try {

      const response = await login(
        email,
        password
      );


      await loginUser(
        response.token
      );


    } catch (error: any) {

      Alert.alert(
        "Login Failed",
        error.message
      );

    }

  }



  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        Login
      </Text>


      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />


      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />


      <Pressable
        style={styles.button}
        onPress={handleLogin}
      >

        <Text style={styles.buttonText}>
          Login
        </Text>

      </Pressable>

      <Pressable
        onPress={() => navigation.navigate("RegisterScreen" as never)}
      >
        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>
      </Pressable>

    </View>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:20,
  },

  title:{
    fontSize:32,
    fontWeight:"700",
    marginBottom:30,
  },

  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:8,
    marginBottom:15,
  },

  button:{
    backgroundColor:"#111",
    padding:15,
    borderRadius:8,
    alignItems:"center",
  },

  buttonText:{
    color:"#fff",
    fontWeight:"700",
  },

  registerText:{
    marginTop:20,
    textAlign:"center",
    color:"#444",
  },

});