import { useCallback, useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { getMyAvailability, saveMyAvailability } from "../api/availability";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function AvailabilityScreen() {
  const [hasNoUsualShifts, setHasNoUsualShifts] = useState(false);
  const [startByDay, setStartByDay] = useState<Record<string, string>>({});
  const [endByDay, setEndByDay] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const data = await getMyAvailability().catch(() => null);
    if (!data) return;
    setHasNoUsualShifts(Boolean(data.hasNoUsualShifts));
    const start: Record<string, string> = {};
    const end: Record<string, string> = {};
    days.forEach((day) => {
      const first = data.weeklyAvailability?.[day]?.[0];
      start[day] = first?.startTime ?? "09:00";
      end[day] = first?.endTime ?? "17:00";
    });
    setStartByDay(start);
    setEndByDay(end);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    try {
      const weeklyAvailability: Record<string, Array<{ startTime: string; endTime: string }>> = {};
      days.forEach((day) => {
        weeklyAvailability[day] = [{ startTime: startByDay[day] ?? "09:00", endTime: endByDay[day] ?? "17:00" }];
      });
      await saveMyAvailability({ hasNoUsualShifts, weeklyAvailability });
      Alert.alert("Saved", "Availability updated.");
    } catch (error: any) {
      Alert.alert("Failed", error.message);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Work Preferences</Text>
      <View style={styles.switchRow}>
        <Text>I have no usual shifts</Text>
        <Switch value={hasNoUsualShifts} onValueChange={setHasNoUsualShifts} />
      </View>
      {!hasNoUsualShifts &&
        days.map((day) => (
          <View key={day} style={styles.dayRow}>
            <Text style={styles.dayLabel}>{day}</Text>
            <TextInput
              style={styles.timeInput}
              value={startByDay[day] ?? "09:00"}
              onChangeText={(value) => setStartByDay((prev) => ({ ...prev, [day]: value }))}
            />
            <Text>-</Text>
            <TextInput
              style={styles.timeInput}
              value={endByDay[day] ?? "17:00"}
              onChangeText={(value) => setEndByDay((prev) => ({ ...prev, [day]: value }))}
            />
          </View>
        ))}
      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Preferences</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 10 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dayRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  dayLabel: { width: 90, textTransform: "capitalize" },
  timeInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 8, width: 80, textAlign: "center" },
  button: { backgroundColor: "#111", borderRadius: 8, padding: 12, marginTop: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

