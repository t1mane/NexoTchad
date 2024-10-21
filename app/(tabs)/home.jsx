import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl, Modal, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
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
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferTimestamp, setTransferTimestamp] = useState(null);

  // States for modals and user info
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false); // User Information modal
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false); // Account Type modal
  const [userInfo, setUserInfo] = useState({
    age: '',
    lastName: '',
    sexe: '',
    name: '',
    profession: ''
  });

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
          
          // Check if user information and accountType are missing
          if (!userData.accountType) {
            const userInfoRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
            const userInfoDoc = await getDoc(userInfoRef);
            if (!userInfoDoc.exists()) {
              setUserInfoModalVisible(true); // Show user info modal if no UserInformation exists
            } else {
              setAccountTypeModalVisible(true); // Show account type modal if no account type exists
            }
          }
        }
      }
    };
    checkUserAccountTypeAndProfile();
  }, []);

  const handleUserInfoSubmit = async () => {
    const { age, lastName, sexe, name, profession } = userInfo;

    if (!age || !lastName || !sexe || !name || !profession) {
      Alert.alert('Erreur', 'Tous les champs sont obligatoires');
      return;
    }

    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const userInfoRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
        await setDoc(userInfoRef, { age, lastName, sexe, name, profession });

        setUserInfoModalVisible(false);
        setAccountTypeModalVisible(true); // Show account type modal next
      } catch (error) {
        console.error("Error saving user info: ", error);
        Alert.alert('Erreur', "Impossible d'enregistrer les informations");
      }
    }
  };

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
        <Balance balance={balance} navigation={navigation} />
        <View style={styles.divider} />
        <Transferfunds />
        <View style={styles.divider} />
        <ContactsNexo />
        <View style={styles.divider} />
        <Topup />
      </ScrollView>

      {/* Unskippable User Information Modal */}
      <Modal visible={userInfoModalVisible} transparent={true} animationType="fade">
        <BlurView intensity={100} style={StyleSheet.absoluteFill}>
          <View style={styles.centeredModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Informations Personnelles</Text>

              <TextInput style={styles.input} placeholder="Nom" value={userInfo.name} onChangeText={(text) => setUserInfo({ ...userInfo, name: text })} />
              <TextInput style={styles.input} placeholder="Prénom" value={userInfo.lastName} onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })} />
              <TextInput style={styles.input} placeholder="Âge" keyboardType="numeric" value={userInfo.age} onChangeText={(text) => setUserInfo({ ...userInfo, age: text })} />
              <TextInput style={styles.input} placeholder="Sexe" value={userInfo.sexe} onChangeText={(text) => setUserInfo({ ...userInfo, sexe: text })} />
              <TextInput style={styles.input} placeholder="Profession" value={userInfo.profession} onChangeText={(text) => setUserInfo({ ...userInfo, profession: text })} />

              <TouchableOpacity style={styles.button} onPress={handleUserInfoSubmit}>
                <Text style={styles.buttonText}>Soumettre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Unskippable Account Type Modal */}
      <Modal visible={accountTypeModalVisible} transparent={true} animationType="fade">
        <BlurView intensity={100} style={StyleSheet.absoluteFill}>
          <View style={styles.centeredModalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Type de Compte</Text>

              <TouchableOpacity style={[styles.buttonLarge, { backgroundColor: '#007BFF' }]} onPress={() => handleAccountTypeSelection('business')}>
                <Text style={styles.buttonText}>Professionnel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonLarge} onPress={() => handleAccountTypeSelection('personal')}>
                <Text style={styles.buttonText}>Personnel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

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
    fontFamily:'oswald'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ff5a00',
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonLarge: {
    backgroundColor: '#ff5a00',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily:'oswald-bold'
  },
});
