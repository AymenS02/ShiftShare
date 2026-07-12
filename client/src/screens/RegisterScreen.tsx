import React, {
  useState,
} from "react";


import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";


import { register } from "../api/auth";



export default function RegisterScreen() {


const [firstName,setFirstName] = useState("");

const [lastName,setLastName] = useState("");

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");



async function handleRegister(){


if(
!firstName ||
!lastName ||
!email ||
!password
){

Alert.alert(
"Error",
"Please fill all fields"
);

return;

}



try {


await register(
firstName,
lastName,
email,
password,
"employee"
);



Alert.alert(
"Success",
"Account created"
);



}
catch(error:any){


Alert.alert(
"Register Failed",
error.message
);


}


}



return (

<View style={styles.container}>


<Text style={styles.title}>
Register
</Text>



<TextInput
style={styles.input}
placeholder="First Name"
value={firstName}
onChangeText={setFirstName}
/>



<TextInput
style={styles.input}
placeholder="Last Name"
value={lastName}
onChangeText={setLastName}
/>



<TextInput
style={styles.input}
placeholder="Email"
value={email}
onChangeText={setEmail}
autoCapitalize="none"
/>



<TextInput
style={styles.input}
placeholder="Password"
value={password}
onChangeText={setPassword}
secureTextEntry
/>



<Pressable
style={styles.button}
onPress={handleRegister}
>

<Text style={styles.buttonText}>
Create Account
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
fontSize:32,
fontWeight:"700",
marginBottom:30,
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
color:"#fff",
fontWeight:"700",
},

});