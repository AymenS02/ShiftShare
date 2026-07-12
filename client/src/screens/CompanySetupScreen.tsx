import { useContext, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { createCompany, joinCompany } from "../api/company";

const defaultSettings = {
  monday: 5,
  tuesday: 5,
  wednesday: 5,
  thursday: 5,
  friday: 5,
  saturday: 2,
  sunday: 0,
};

export default function CompanySetupScreen() {
  const { user, refreshUser } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const isManager = user?.role === "manager";

  async function handleSubmit() {
    try {
      if (isManager) {
        if (!companyName.trim()) {
          Alert.alert("Validation", "Please enter a company name.");
          return;
        }
        await createCompany(companyName.trim(), defaultSettings);
      } else {
        if (!companyCode.trim()) {
          Alert.alert("Validation", "Please enter a company code.");
          return;
        }
        await joinCompany(companyCode.trim().toUpperCase());
      }
      await refreshUser();
    } catch (error: any) {
      Alert.alert("Action failed", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isManager ? "Create Your Company" : "Join a Company"}</Text>
      {isManager ? (
        <TextInput
          style={styles.input}
          placeholder="Company name"
          value={companyName}
          onChangeText={setCompanyName}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Company code"
          value={companyCode}
          onChangeText={setCompanyCode}
          autoCapitalize="characters"
        />
      )}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isManager ? "Create Company" : "Join Company"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, gap: 12 },
  title: { fontSize: 26, fontWeight: "700" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12 },
  button: { backgroundColor: "#111", borderRadius: 10, padding: 14, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

