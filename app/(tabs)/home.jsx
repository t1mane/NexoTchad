import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Header from "./../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "./../../components/Home/Transferfunds";
import ContactsNexo from "./../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";
import ProfileModal from "./../../components/Home/ProfileModal"; // Import the profile modal component

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false); // For Profile Modal
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false); // For Account Type Modal
  const [accountType, setAccountType] = useState(null);

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

  // Check if accountType exists and show modal if missing
  useEffect(() => {
    const checkUserAccountTypeAndProfile = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Check if accountType exists
          if (!userData.accountType) {
            setAccountTypeModalVisible(true); // Show Account Type modal first if missing
          } else {
            setAccountType(userData.accountType);
            
            // After accountType, check if profile is incomplete (e.g., name is missing)
            const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
            const profileSnap = await getDoc(profileRef);
            if (!profileSnap.exists() || !profileSnap.data().name) {
              setProfileModalVisible(true); // Show Profile Modal if profile info is missing
            }
          }
        }
      }
    };

    checkUserAccountTypeAndProfile();
  }, []);

  // Function to handle account type selection
  const handleAccountTypeSelection = async (type) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'Users', user.uid);
      try {
        // Update the accountType in Firestore
        await setDoc(userDocRef, { accountType: type }, { merge: true });
        setAccountType(type);
        setAccountTypeModalVisible(false); // Close the Account Type Modal

        // Now, check if profile modal should be shown (if profile is incomplete)
        const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (!profileSnap.exists() || !profileSnap.data().name) {
          setProfileModalVisible(true); // Show Profile Modal if needed
        }

      } catch (error) {
        console.error('Error updating account type:', error);
      }
    }
  };

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

      {/* Modal to choose account type */}
      <Modal
        visible={accountTypeModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Veuillez sélectionner votre type de compte</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleAccountTypeSelection('personal')}
              >
                <Text style={styles.buttonText}>Compte Personnel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={() => handleAccountTypeSelection('business')}
              >
                <Text style={styles.buttonText}>Compte Professionnel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',  // Stack buttons vertically
    width: '100%',
  },
  button: {
    backgroundColor: '#ff5a00', // Same as other parts of the app
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15, // Add margin between buttons
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
