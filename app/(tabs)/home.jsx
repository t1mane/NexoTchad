import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Header from "./../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "./../../components/Home/Transferfunds";
import ContactsNexo from "./../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";
import ProfileModal from "./../../components/Home/ProfileModal"; // Import the modal component

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

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
    } else {
      console.log("No authenticated user found.");
    }
  };

  const onRefresh = useCallback(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setRefreshing(true);
      fetchBalance().finally(() => {
        setRefreshing(false);
      });
    } else {
      console.log("Cannot refresh without an authenticated user.");
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchBalanceIfAuthenticated = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user && isSubscribed) {
        await fetchBalance();
      } else {
        console.log("No authenticated user found on component mount.");
      }
    };

    fetchBalanceIfAuthenticated();

    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    const checkUserProfile = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists() || !profileSnap.data().name) {
          // Show modal if profile data is missing or incomplete
          setProfileModalVisible(true);
        }
      }
    };

    checkUserProfile();
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
        {/* Pass the `refreshing` state to the Header component */}
        <Header refreshing={refreshing} />
        <View style={styles.divider} />
        <Balance balance={balance} />
        <View style={styles.divider} />
        <Transferfunds />
        <View style={styles.divider} />
        <ContactsNexo />
        <View style={styles.divider} />
        <Topup />
      </ScrollView>
      <ProfileModal 
        visible={profileModalVisible} 
        onClose={() => setProfileModalVisible(false)} 
      />
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
