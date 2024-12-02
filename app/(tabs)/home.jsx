import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, ScrollView, RefreshControl, Modal, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from "react";
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { BlurView } from 'expo-blur'; // Import BlurView for background blur
import Header from "./../../components/Home/Header";
import Balance from "./../../components/Home/Balance";
import Transferfunds from "./../../components/Home/Transferfunds";
import ContactsNexo from "./../../components/Home/ContactsNexo";
import Topup from "./../../components/Home/Topup";
import ProfileModal from "./../../components/Home/ProfileModal";

export default function HomeScreen() {
  const route = useRoute();  // Get route for checking navigation params
  const navigation = useNavigation(); 
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(null);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferTimestamp, setTransferTimestamp] = useState(null);

  // States for user info modals
  const [userInfoModalVisible, setUserInfoModalVisible] = useState(false); // User Information modal
  const [accountTypeModalVisible, setAccountTypeModalVisible] = useState(false); // Account Type modal
  const [userInfo, setUserInfo] = useState({
    age: '',
    lastName: '',
    sexe: '',
    name: '',
    profession: ''
  });
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Default to true to avoid initial blur flash

// Check if the user's email is verified
useEffect(() => {
  const checkEmailVerification = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      await user.reload(); // Refresh user state to get the latest verification status
      setIsEmailVerified(user.emailVerified);
    }
  };

  checkEmailVerification();
}, []);


  // Fetch balance for the user
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

  // Check if user needs to complete their profile (new user)
  useEffect(() => {
    const checkUserAccountTypeAndProfile = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIRESTORE_DB, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // If accountType is not set, prompt the user
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

  // Submit user information and close the modal
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

  // Handle account type selection
  const handleAccountTypeSelection = async (type) => {
    let accountDetails;
  
    // Set account details based on the selected type
    switch (type) {
      case 'personel':
        accountDetails = {
          title: 'Compte Personel',
          description: '0 F PAR MOIS\n⚬ Montant illimité de transactions\n⚬ 3% de frais de retrait\n⚬ Limite de retrait de 100,000 F par mois',
        };
        break;
      case 'business':
        accountDetails = {
          title: 'Compte Business',
          description: '25,000 F PAR MOIS\n⚬ Montant illimité de transactions\n⚬ Frais de retrait : 0%\n⚬ retraits illimités mensuellement\n⚬ Dépôts bancaires gratuits',
        };
        break;
      case 'privilege':
        accountDetails = {
          title: 'Compte Privilege',
          description: '5,000 F PAR MOIS\n⚬ Montant illimité de transactions\n⚬ Frais de retrait : 0%\n⚬ Limite de retrait de 500,000 F par mois\n⚬ Service client prioritaire',
        };
        break;
      default:
        return;
    }
  
    // Show confirmation alert
    Alert.alert(
      `Confirmer ${accountDetails.title}`,
      accountDetails.description,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
              const userDocRef = doc(FIRESTORE_DB, 'Users', user.uid);
              await setDoc(userDocRef, { accountType: type }, { merge: true });
              setAccountTypeModalVisible(false); // Close the modal
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  

  // Check if the navigation parameters include email and openTransferModal flag
  useEffect(() => {
    if (route.params?.email && route.params?.openTransferModal && route.params?.timestamp !== transferTimestamp) {
      setTransferEmail(route.params.email);  // Set the email from QR code
      setTransferModalVisible(true);  // Show transfer modal
      setTransferTimestamp(route.params.timestamp);  // Track the timestamp to avoid multiple triggers
    }
  }, [route.params?.email, route.params?.openTransferModal, route.params?.timestamp]);

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
  
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={userInfo.name}
                onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                placeholderTextColor="#777" // Full black placeholder text
              />
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={userInfo.lastName}
                onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
                placeholderTextColor="#777" // Full black placeholder text
              />
              <TextInput
                style={styles.input}
                placeholder="Âge"
                keyboardType="numeric"
                value={userInfo.age}
                onChangeText={(text) => setUserInfo({ ...userInfo, age: text })}
                placeholderTextColor="#777" // Full black placeholder text
              />
              <TextInput
                style={styles.input}
                placeholder="Sexe"
                value={userInfo.sexe}
                onChangeText={(text) => setUserInfo({ ...userInfo, sexe: text })}
                placeholderTextColor="#777" // Full black placeholder text
              />
              <TextInput
                style={styles.input}
                placeholder="Profession"
                value={userInfo.profession}
                onChangeText={(text) => setUserInfo({ ...userInfo, profession: text })}
                placeholderTextColor="#777" // Full black placeholder text
              />
  
              <TouchableOpacity style={styles.button} onPress={handleUserInfoSubmit}>
                <Text style={styles.buttonText}>Soumettre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
  
      {/* Unskippable Account Type Modal */}
      {/* Updated Account Type Modal */}
<Modal visible={accountTypeModalVisible} transparent={true} animationType="fade">
  <BlurView intensity={100} style={StyleSheet.absoluteFill}>
    <View style={styles.centeredModalContainer}>
      <ScrollView
      contentContainerStyle={styles.modalScrollContainer} 
      showsVerticalScrollIndicator={false}
      >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Sélectionnez votre type de compte</Text>

        {/* Account Type: Personel */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Personel</Text>
          <Text style={styles.accountPrice}>0 F PAR MOIS</Text>
          <Text style={styles.accountFeature}>⚬ Montant illimité de transactions</Text>
          <Text style={styles.accountFeature}>⚬ 2% de frais par transaction</Text>
          <Text style={styles.accountFeature}>⚬ Frais de 3% par retrait</Text>
          <Text style={styles.accountFeature}>⚬ Limite de retrait de 100,000 F par mois</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleAccountTypeSelection('personel')}
          >
            <Text style={styles.selectButtonText}>Sélectionner</Text>
          </TouchableOpacity>

        </View>

        {/* Account Type: Business */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Business</Text>
          <Text style={styles.accountPrice}>25,000 F PAR MOIS</Text>
          <Text style={styles.accountFeature}>⚬ Montant illimité de transactions</Text>
          <Text style={styles.accountFeature}>⚬ 0% de frais par transaction</Text>
          <Text style={styles.accountFeature}>⚬ Frais de retrait : 0%</Text>
          <Text style={styles.accountFeature}>⚬ montants de retraits gratuits et illimités</Text>
          <Text style={styles.accountFeature}>⚬ Dépôts bancaires gratuits</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleAccountTypeSelection('business')}
          >
            <Text style={styles.selectButtonText}>Sélectionner</Text>
          </TouchableOpacity>
        </View>

        {/* Account Type: Privilege */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Privilege</Text>
          <Text style={styles.accountPrice}>5,000 F PAR MOIS</Text>
          <Text style={styles.accountFeature}>⚬ Montant illimité de transactions</Text>
          <Text style={styles.accountFeature}>⚬ Frais de retrait : 0%</Text>
          <Text style={styles.accountFeature}>⚬ Limite de retrait de 500,000 F par mois</Text>
          <Text style={styles.accountFeature}>⚬ Service client prioritaire</Text>
          <Text style={styles.accountFeature}>⚬ frais de 1% pour Dépôts bancaires</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleAccountTypeSelection('privilege')}
          >
            <Text style={styles.selectButtonText}>Sélectionner</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
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
                  email={transferEmail} // Prefill email from QR code
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
  
      {/* Blur and Overlay for Unverified Email */}
      {!isEmailVerified && (
        <BlurView intensity={100} style={StyleSheet.absoluteFill} tint="dark">
          <View style={styles.overlayContainer}>
            <Text style={styles.overlayText}>
              Vous devez confirmer votre email avant de pouvoir accéder à cet onglet.
            </Text>
          </View>
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
    paddingBottom: 20,
  },
  divider: {
    borderBottomColor: '#d6d6d6',
    borderBottomWidth: 1,
    marginVertical: 10,
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
    fontFamily: 'oswald',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily:'oswald',
    
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
    fontFamily: 'oswald-bold',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'oswald',
  },
  accountCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff5a00',
    marginBottom: 10,
    fontFamily: 'oswald',
  },
  accountPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    fontFamily: 'oswald-bold',
  },
  accountFeature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'oswald',
  },
  selectButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'oswald',
  },
  modalScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
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
  
  
  
});