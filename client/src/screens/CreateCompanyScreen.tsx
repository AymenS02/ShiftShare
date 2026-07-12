import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../hooks/useAuth";


export default function CreateCompanyScreen() {

  const [companyName, setCompanyName] =
    useState("");

  const {
    createCompany,
  } = useAuth();


  async function handleCreateCompany() {

    if (!companyName.trim()) {
      Alert.alert(
        "Error",
        "Please enter a company name"
      );
      return;
    }


    try {

      await createCompany(
        companyName
      );


      Alert.alert(
        "Success",
        "Company created!"
      );


    } catch(error:any) {

      Alert.alert(
        "Error",
        error.message
      );

    }
  }


  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Create Your Company
      </Text>


      <Text style={styles.subtitle}>
        You need a company before using ShiftShare
      </Text>


      <TextInput

        placeholder="Company Name"

        value={companyName}

        onChangeText={setCompanyName}

        style={styles.input}

      />


      <Pressable
        style={styles.button}
        onPress={handleCreateCompany}
      >

        <Text style={styles.buttonText}>
          Create Company
        </Text>

      </Pressable>


    </View>

  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
  },


  title:{
    fontSize:26,
    fontWeight:"bold",
    marginBottom:10,
  },


  subtitle:{
    textAlign:"center",
    marginBottom:20,
  },


  input:{
    width:"80%",
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:5,
  },


  button:{
    marginTop:20,
    backgroundColor:"black",
    padding:15,
    width:"80%",
    alignItems:"center",
    borderRadius:5,
  },


  buttonText:{
    color:"white",
    fontWeight:"bold",
  },

});