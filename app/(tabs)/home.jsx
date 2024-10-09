import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Header from "../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "../../components/Home/Transferfunds";
import ContactsNexo from "../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <Header />

      {/* Divider between Header and Balance */}
      <View style={styles.divider} />

      {/* Balances */}
      <Balance />

      {/* Divider between Balance and Transfer funds */}

      {/* Transfer funds */}
      <Transferfunds />

      {/* Divider between Transfer funds and Contacts */}
      <View style={styles.divider} />

      {/* Contacts */}
      <ContactsNexo />

      <View style={styles.divider} />

      {/* Top UP */}
      <Topup />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    paddingBottom: 40, // Additional padding at the bottom for better spacing with the tab bar
  },
  divider: {
    borderBottomColor: '#d6d6d6',  // Light gray color for the divider
    borderBottomWidth: 1,          // Set thickness of the line
    marginVertical: 20,            // Space around the divider
  },
});
