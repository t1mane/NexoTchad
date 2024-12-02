import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState(null);
  const [accountType, setAccountType] = useState(null); // New state for account type
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [fieldValue, setFieldValue] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const fetchProfileData = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
        const profileSnap = await getDoc(profileRef);

        const userRef = doc(FIRESTORE_DB, "Users", user.uid);
        const userSnap = await getDoc(userRef);

        if (profileSnap.exists()) {
          setProfileData(profileSnap.data());
        } else {
          console.log("No profile data found.");
        }

        if (userSnap.exists()) {
          setEmail(userSnap.data().email);
          setAccountType(userSnap.data().accountType); // Fetch and set the account type
        } else {
          console.log("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData().finally(() => setRefreshing(false));
  }, []);

  const openModal = (field) => {
    setFieldToEdit(field);
    setFieldValue(profileData[field]);
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
        await updateDoc(profileRef, { [fieldToEdit]: fieldValue });
        setProfileData((prevData) => ({ ...prevData, [fieldToEdit]: fieldValue }));
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error updating profile data: ", error);
      }
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff5a00"
          />
        }
      >
        <Text style={styles.headerText}>Profil Utilisateur</Text>

        {profileData ? (
          <View style={styles.profileBox}>
            {['name', 'lastName', 'profession'].map((field) => (
              <View key={field} style={styles.infoRow}>
                <Text style={styles.infoText}>
                  <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}:</Text> {profileData[field]}
                </Text>
                <TouchableOpacity onPress={() => openModal(field)} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Text style={styles.infoText}><Text style={styles.label}>Âge:</Text> {profileData.age}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Sexe:</Text> {profileData.sex}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {email}</Text>

            {/* Account Type Display */}
            {accountType && (
  <View style={styles.accountTypeContainer}>
    <Text style={styles.accountTypeLabel}>Type de compte:</Text>
    <Text style={styles.accountTypeValue}>
      {accountType === 'personel'
        ? 'Compte Personnel'
        : accountType === 'business'
        ? 'Compte Business'
        : accountType === 'privilege'
        ? 'Compte Privilege'
        : 'Type de compte inconnu'}
    </Text>
  </View>
)}

          
          </View>
        ) : (
          <Text style={styles.loadingText}>Chargement des informations...</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Se Déconnecter</Text>
        </TouchableOpacity>

        {/* Modal for editing profile fields */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Modifier {fieldToEdit}</Text>
              <TextInput
                style={styles.modalInput}
                value={fieldValue}
                onChangeText={setFieldValue}
                placeholder={`Entrez le nouveau ${fieldToEdit}`}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    justifyContent: 'space-between', // Space evenly to push logout button down
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5a00',
    fontFamily: 'Oswald-Bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  profileBox: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Oswald',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#ff5a00',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Oswald',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
  // Account Type Container
  accountTypeContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  accountTypeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
    color: '#ff5a00',
  },
  accountTypeValue: {
    fontSize: 22, // Larger font size for account type
    fontWeight: 'bold',
    fontFamily: 'Oswald',
    color: '#333',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Subtle overlay effect
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Oswald',
    marginBottom: 15,
  },
  modalInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    fontSize: 18,
    color: '#333',
    fontFamily: 'Oswald',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
  cancelButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
});
