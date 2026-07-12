import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome, {user?.firstName ?? "Employee"}
      </Text>

      <Text style={styles.subtitle}>
        Role: {user?.role ?? "employee"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Upcoming Shift
        </Text>

        <Text>
          No upcoming shifts yet.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Pending Requests
        </Text>

        <Text>
          You have no pending requests.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    color: "gray",
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});