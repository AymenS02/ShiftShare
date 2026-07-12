import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { listAuditLogs } from "../api/audit";

export default function AuditHistoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listAuditLogs();
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
      ListHeaderComponent={<Text style={styles.title}>Audit History</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.action}>{item.action}</Text>
          <Text>{item.targetType} • {new Date(item.timestamp).toLocaleString()}</Text>
          <Text>By: {item.performedBy?.firstName ?? "Unknown"} {item.performedBy?.lastName ?? ""}</Text>
        </View>
      )}
      ListEmptyComponent={<Text>No audit logs.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 4 },
  action: { fontWeight: "700" },
});

