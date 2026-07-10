import { View, Text, StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          A
        </Text>
      </View>

      <Text style={styles.name}>
        FirstName LastName
      </Text>

      <Text style={styles.email}>
        user@email.com
      </Text>

      <View style={styles.card}>
        <Text>
          Total Shifts: 0
        </Text>

        <Text>
          Hours Worked: 0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },

  email: {
    color: "gray",
    marginTop: 5,
  },

  card: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});