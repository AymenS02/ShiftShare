import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { listCompanyEmployees, removeEmployee } from "../api/company";

export default function EmployeeManagementScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listCompanyEmployees();
      setItems(data.filter((u: any) => u.role === "employee"));
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
      ListHeaderComponent={<Text style={styles.title}>Employees</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text>{item.email}</Text>
          <Pressable style={styles.button} onPress={() => removeEmployee(item._id).then(load)}>
            <Text style={styles.buttonText}>Remove</Text>
          </Pressable>
        </View>
      )}
      ListEmptyComponent={<Text>No employees.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 },
  name: { fontWeight: "700" },
  button: { backgroundColor: "#b83232", borderRadius: 8, padding: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

