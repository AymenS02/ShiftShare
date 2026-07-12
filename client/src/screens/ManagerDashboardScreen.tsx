import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { listCompanyEmployees } from "../api/company";
import { listCompanyShifts, listOpenShifts } from "../api/shifts";

export default function ManagerDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ employees: 0, totalShifts: 0, openShifts: 0 });

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const [employees, shifts, open] = await Promise.all([
        listCompanyEmployees(),
        listCompanyShifts(),
        listOpenShifts(),
      ]);
      setStats({
        employees: employees.length,
        totalShifts: shifts.length,
        openShifts: open.length,
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    >
      <Text style={styles.title}>Manager Dashboard</Text>
      <View style={styles.card}><Text>Employees: {stats.employees}</Text></View>
      <View style={styles.card}><Text>Total Shifts: {stats.totalShifts}</Text></View>
      <View style={styles.card}><Text>Open Shifts: {stats.openShifts}</Text></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 14, marginBottom: 10 },
});

