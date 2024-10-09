import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "../../components/Home/Transferfunds";
import ContactsNexo from "../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
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
      {/* Optionally, make the status bar translucent */}
      <StatusBar style="dark" translucent={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9', // Adjust to match your app’s background color
  },
  container: {
    padding: 20,
    marginTop: -40,
    paddingBottom: 40, // Additional padding at the bottom for better spacing with the tab bar
  },
  divider: {
    borderBottomColor: '#d6d6d6',  // Light gray color for the divider
    borderBottomWidth: 1,          // Set thickness of the line
    marginVertical: 20,            // Space around the divider
  },
});
