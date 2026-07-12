import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { getMyCompany, updateCompany, updateCompanySettings } from "../api/company";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function CompanySettingsScreen() {
  const [companyName, setCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [limits, setLimits] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const company = await getMyCompany();
    setCompanyName(company.companyName ?? "");
    setCompanyCode(company.companyCode ?? "");
    const next: Record<string, string> = {};
    days.forEach((day) => {
      next[day] = String(company.schedulingSettings?.[day] ?? 0);
    });
    setLimits(next);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    try {
      await updateCompany({ companyName, companyCode });
      const schedulingSettings: Record<string, number> = {};
      days.forEach((day) => {
        schedulingSettings[day] = Number(limits[day] ?? 0);
      });
      await updateCompanySettings(schedulingSettings);
      Alert.alert("Saved", "Company settings updated.");
    } catch (error: any) {
      Alert.alert("Failed", error.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Company Settings</Text>
      <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company name" />
      <TextInput style={styles.input} value={companyCode} onChangeText={setCompanyCode} placeholder="Company code" autoCapitalize="characters" />
      <Text style={styles.subtitle}>Daily worker limits</Text>
      {days.map((day) => (
        <View key={day} style={styles.row}>
          <Text style={styles.day}>{day}</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            value={limits[day] ?? "0"}
            onChangeText={(value) => setLimits((prev) => ({ ...prev, [day]: value }))}
          />
        </View>
      ))}
      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Settings</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: "700", marginTop: 8, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 10, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  day: { textTransform: "capitalize" },
  smallInput: { width: 90, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, textAlign: "center" },
  button: { backgroundColor: "#111", borderRadius: 8, padding: 12, marginTop: 12, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

