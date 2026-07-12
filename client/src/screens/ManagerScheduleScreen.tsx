import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { createShift, generateSchedule, listCompanyShifts } from "../api/shifts";

export default function ManagerScheduleScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listCompanyShifts();
      setItems(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleQuickOpenShift() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await createShift({
        date: today,
        startTime: "09:00",
        endTime: "17:00",
        status: "open",
      });
      await load();
    } catch (error: any) {
      Alert.alert("Failed", error.message);
    }
  }

  async function handleGenerateWeek() {
    try {
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + 6);
      await generateSchedule({
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        startTime: "09:00",
        endTime: "17:00",
      });
      await load();
    } catch (error: any) {
      Alert.alert("Failed", error.message);
    }
  }

  return (
    <FlatList
      style={styles.container}
      data={items}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListHeaderComponent={
        <View style={{ marginBottom: 12, gap: 8 }}>
          <Text style={styles.title}>Manager Schedule</Text>
          <Pressable style={styles.button} onPress={handleQuickOpenShift}>
            <Text style={styles.buttonText}>Create Open Shift (Today)</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleGenerateWeek}>
            <Text style={styles.buttonText}>Generate 7-Day Schedule</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.main}>{item.date} • {item.startTime} - {item.endTime}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No shifts found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700" },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 },
  main: { fontWeight: "700" },
  button: { backgroundColor: "#111", borderRadius: 8, padding: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

