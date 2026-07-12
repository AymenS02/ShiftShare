import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { listMyNotifications, markNotificationRead } from "../api/notifications";

export default function NotificationsScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await listMyNotifications();
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
      ListHeaderComponent={<Text style={styles.title}>Notifications</Text>}
      renderItem={({ item }) => (
        <View style={[styles.card, item.read && styles.read]}>
          <Text style={styles.type}>{item.type}</Text>
          <Text>{item.message}</Text>
          {!item.read ? (
            <Pressable onPress={() => markNotificationRead(item._id).then(load)}>
              <Text style={styles.action}>Mark as read</Text>
            </Pressable>
          ) : null}
        </View>
      )}
      ListEmptyComponent={<Text>No notifications.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 10, gap: 6 },
  read: { opacity: 0.6 },
  type: { fontWeight: "700" },
  action: { color: "#1d4ed8", fontWeight: "700" },
});

