import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import React, {
  useEffect,
  useState
} from "react";

import {
  getCurrentUser
} from "../api/auth";

export default function ProfileScreen() {

  const { logout } = useContext(AuthContext);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    fetchUser();
  }, []);

  async function handleLogout() {

    await logout();

  }

  return (

    <View style={styles.container}>


      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          A
        </Text>
      </View>



      <Text style={styles.name}>
        {user?.firstName} {user?.lastName}
      </Text>



      <Text style={styles.email}>
        {user?.email}
      </Text>



      <View style={styles.card}>

        <Text>
          Total Shifts: 0
        </Text>


        <Text>
          Hours Worked: 0
        </Text>

      </View>



      <Pressable
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </Pressable>


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


  logoutButton: {
    marginTop: 40,
    backgroundColor: "#111",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },


  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

});