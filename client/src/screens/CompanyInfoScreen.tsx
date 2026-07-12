import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { getMyCompany } from "../api/company";

export default function CompanyInfoScreen() {
  const [company, setCompany] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getMyCompany();
      setCompany(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (!company) {
    return (
      <View style={styles.center}>
        <Text>Loading company...</Text>
      </View>
    );
  }

  const settings = Object.entries(company.schedulingSettings ?? {});

  return (
    <FlatList
      style={styles.container}
      data={settings}
      keyExtractor={([day]) => day}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListHeaderComponent={
        <View style={{ gap: 6, marginBottom: 16 }}>
          <Text style={styles.title}>{company.companyName}</Text>
          <Text style={styles.subtitle}>Code: {company.companyCode}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemDay}>{item[0]}</Text>
          <Text style={styles.itemValue}>{String(item[1])} max workers</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#666" },
  item: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDay: { fontWeight: "700", textTransform: "capitalize" },
  itemValue: { color: "#333" },
});

