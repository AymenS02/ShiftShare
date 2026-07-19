import React, {
  useState,
} from "react";


import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";


import {
  useNavigation,
} from "@react-navigation/native";


import {
  joinCompany,
} from "../api/company";



export default function JoinCompanyScreen(){


  const [companyCode,setCompanyCode] =
    useState("");


  const navigation =
    useNavigation();




  async function handleJoinCompany(){


    if(!companyCode){

      Alert.alert(
        "Error",
        "Enter a company code"
      );

      return;

    }



    try{


      await joinCompany(
        companyCode
      );



      Alert.alert(
        "Success",
        "Joined company!"
      );



      navigation.navigate(
        "Main" as never
      );


    }
    catch(error:any){


      Alert.alert(
        "Error",
        error.message
      );


    }


  }





  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        Join Company
      </Text>



      <Text style={styles.subtitle}>
        Enter the code provided by your manager
      </Text>



      <TextInput

        placeholder="Company Code"

        value={companyCode}

        onChangeText={setCompanyCode}

        autoCapitalize="characters"

        style={styles.input}

      />



      <Pressable

        style={styles.button}

        onPress={handleJoinCompany}

      >

        <Text style={styles.buttonText}>
          Join Company
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
  fontSize:28,
  fontWeight:"bold",
  marginBottom:10,
},


subtitle:{
  marginBottom:25,
},


input:{
  borderWidth:1,
  borderColor:"#ccc",
  padding:12,
  borderRadius:8,
  marginBottom:15,
},


button:{
  backgroundColor:"#111",
  padding:15,
  borderRadius:8,
  alignItems:"center",
},


buttonText:{
  color:"white",
  fontWeight:"bold",
},


});