import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl, Modal, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur'; // Import BlurView
import Header from "./../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "./../../components/Home/Transferfunds";
import ContactsNexo from "./../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";
import ProfileModal from "./../../components/Home/ProfileModal";

export default function HomeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferTimestamp, setTransferTimestamp] = useState(null); // Add state for timestamp

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBalance().finally(() => setRefreshing(false));
  }, []);

  // Show modal if email is passed and openTransferModal is true, and timestamp changes
  useEffect(() => {
    if (route.params?.email && route.params?.openTransferModal && route.params?.timestamp !== transferTimestamp) {
      setTransferEmail(route.params.email);
      setTransferModalVisible(true);
      setTransferTimestamp(route.params.timestamp); // Update timestamp to track scans
    }
  }, [route.params?.email, route.params?.openTransferModal, route.params?.timestamp]);

  useEffect(() => {
    if (!transferModalVisible) {
      setTransferEmail('');
    }
  }, [transferModalVisible]);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    const checkUserAccountTypeAndProfile = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.accountType) {
            setAccountTypeModalVisible(true);
          }
        }
      }
    };
    checkUserAccountTypeAndProfile();
  }, []);

  const handleAccountTypeSelection = async (type) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, 'Users', user.uid);
      await setDoc(userDocRef, { accountType: type }, { merge: true });
      setAccountTypeModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ff5a00" />}
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

      {/* Blur Background and Transfer Modal */}
      {transferModalVisible && (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
          <Modal
            visible={transferModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setTransferModalVisible(false)}
          >
            <View style={styles.centeredModalContainer}>
              <View style={styles.modalContent}>
                <Transferfunds
                  visible={transferModalVisible}
                  email={transferEmail}
                  onClose={() => setTransferModalVisible(false)}
                  onTransferSuccess={() => {
                    setTransferModalVisible(false);
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'home' }],
                      })
                    );
                  }}
                />
              </View>
            </View>
          </Modal>
        </BlurView>
      )}

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
    paddingBottom: 40,
  },
  divider: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  centeredModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.84,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    backgroundColor: '#ff5a00',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
