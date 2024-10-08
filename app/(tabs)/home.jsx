import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";
import Header from "../../components/Home/Header";
import  Balance from "./../../components/Home/Balance"

export default function HomeScreen() {
  return (
    <View style={{
      padding:20,
      marginTop:20
    }}>

      {/* Header */}
      <Header/>


      {/* Balances */}
      <Balance/>

      
      {/* Transfer funds */}


      {/* contacts */}


      {/* Top UP */}


    
      


    </View>
  );
}
