import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Header from "../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "../../components/Home/Transferfunds";
import ContactsNexo from "../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(null);

  // Function to fetch the balance from Firestore
  const fetchBalance = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userDocRef = doc(FIRESTORE_DB, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setBalance(userDoc.data().balance);
        } else {
          console.log('No user document found!');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  // Function to handle refreshing
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBalance().finally(() => {
      setRefreshing(false);
    });
  }, []);

  // Fetch balance when the component mounts
  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff5a00"
          />
        }
      >
        {/* Header */}
        <Header />

        {/* Divider between Header and Balance */}
        <View style={styles.divider} />

        {/* Balances */}
        <Balance balance={balance} />

        {/* Divider between Balance and Transfer funds */}
        <View style={styles.divider} />

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
      <StatusBar style="dark" translucent={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 20,
    marginTop: -40,
    paddingBottom: 40,
  },
  divider: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
});
