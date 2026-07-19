import React from "react";

import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import {
  useNavigation,
} from "@react-navigation/native";



export default function CompanySetupScreen() {


  const navigation = useNavigation();



  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        Welcome to ShiftShare
      </Text>


      <Text style={styles.subtitle}>
        To get started, create a company
        or join an existing one.
      </Text>



      <Pressable

        style={styles.button}

        onPress={() =>
          navigation.navigate(
            "CreateCompanyScreen" as never
          )
        }

      >

        <Text style={styles.buttonText}>
          Create a Company
        </Text>

      </Pressable>




      <Pressable

        style={styles.secondaryButton}

        onPress={() =>
          navigation.navigate(
            "JoinCompanyScreen" as never
          )
        }

      >

        <Text style={styles.secondaryButtonText}>
          Join a Company
        </Text>

      </Pressable>



    </View>

  );

}



const styles = StyleSheet.create({

container:{
  flex:1,
  justifyContent:"center",
  padding:20,
},


title:{
  fontSize:30,
  fontWeight:"bold",
  marginBottom:15,
},


subtitle:{
  fontSize:16,
  marginBottom:40,
},


button:{
  backgroundColor:"#111",
  padding:15,
  borderRadius:8,
  alignItems:"center",
  marginBottom:15,
},


buttonText:{
  color:"white",
  fontWeight:"bold",
},


secondaryButton:{
  borderWidth:1,
  borderColor:"#111",
  padding:15,
  borderRadius:8,
  alignItems:"center",
},


secondaryButtonText:{
  color:"#111",
  fontWeight:"bold",
},


});