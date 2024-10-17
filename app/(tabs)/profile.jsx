import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [email, setEmail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      router.replace('/LoginScreen'); // Navigate back to login screen after sign-out
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
            <Text style={styles.infoText}><Text style={styles.label}>Nom:</Text> {profileData.name}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Prénom:</Text> {profileData.lastName}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Âge:</Text> {profileData.age}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Sexe:</Text> {profileData.sex}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Profession:</Text> {profileData.profession}</Text>
            <Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {email}</Text>
          </View>
        ) : (
          <Text style={styles.loadingText}>Chargement des informations...</Text>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Se Déconnecter</Text>
        </TouchableOpacity>
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
});
