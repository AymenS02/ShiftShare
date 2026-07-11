import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  Main: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");

  function handleLogin() {
    if (!email || !password || !companyCode) {
      Alert.alert("Error", "Please enter your email, password, and company code");
      return;
    }

    // TODO: Replace this with real authentication
    console.log({
      email,
      password,
      companyCode,
    });

    // Go to the app after login
    navigation.navigate("Main");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login to ShiftShare
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Company Code"
        value={companyCode}
        onChangeText={setCompanyCode}
        style={styles.input}
      />

      <Pressable
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Login
        </Text>
      </Pressable>

      <Text style={styles.forgot}>
        Forgot Password?
      </Text>

      <Text
        onPress={() => navigation.navigate("RegisterScreen")}
        style={styles.link}
      >
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 8,
    width: "80%",
    borderRadius: 5,
  },

  button: {
    backgroundColor: "black",
    padding: 12,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  forgot: {
    color: "blue",
    marginTop: 15,
  },

  link: {
    color: "blue",
    marginTop: 15,
  },
});