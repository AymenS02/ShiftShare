import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { emergencyReleaseShift, listMyShifts } from "../api/shifts";

export default function MyScheduleScreen() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listMyShifts();
      setShifts(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <FlatList
      style={styles.container}
      data={shifts}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListHeaderComponent={<Text style={styles.title}>My Schedule</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.main}>{item.date} • {item.startTime} - {item.endTime}</Text>
          <Text>Status: {item.status}</Text>
          {item.employeeId ? (
            <Pressable style={styles.button} onPress={() => emergencyReleaseShift(item._id).then(load)}>
              <Text style={styles.buttonText}>Emergency Absence</Text>
            </Pressable>
          ) : null}
        </View>
      )}
      ListEmptyComponent={<Text>No shifts found.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 8 },
  main: { fontWeight: "700" },
  button: { backgroundColor: "#b83232", borderRadius: 8, padding: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

