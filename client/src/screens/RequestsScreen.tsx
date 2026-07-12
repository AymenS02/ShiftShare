import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { listCoverageRequests, respondCoverageRequest } from "../api/coverage";

export default function RequestsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listCoverageRequests();
      setItems(data);
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
      data={items}
      keyExtractor={(item) => item._id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListHeaderComponent={<Text style={styles.title}>Coverage Requests</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.bold}>Status: {item.status}</Text>
          <Text>Shift: {item.shiftId?.date} • {item.shiftId?.startTime}-{item.shiftId?.endTime}</Text>
          {item.status === "pending" ? (
            <View style={styles.row}>
              <Pressable
                style={[styles.button, { backgroundColor: "#16a34a" }]}
                onPress={() => respondCoverageRequest(item._id, "accepted").then(load)}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: "#b91c1c" }]}
                onPress={() => respondCoverageRequest(item._id, "declined").then(load)}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      )}
      ListEmptyComponent={<Text>No requests yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 },
  row: { flexDirection: "row", gap: 8 },
  button: { borderRadius: 8, padding: 8, flex: 1, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
  bold: { fontWeight: "700" },
});