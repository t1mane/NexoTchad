import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './../../config/FirebaseConfig'; // Import Firebase config

export default function Balance({ navigation }) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Set up a real-time listener on the user's balance in the 'Users' collection
      const userRef = doc(db, 'Users', user.uid);

      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setBalance(userData.balance);
        } else {
          console.log('No such document!');
        }
        setLoading(false); // Stop loading once we have the balance data
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [user]);

  const handlePress = () => {
    console.log('Balance component pressed');
    navigation.navigate('Recent'); // Assuming Recent is the name of your screen
  };

  return (
    <TouchableOpacity style={styles.outerContainer} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.container}>
        <Image
          style={styles.image1}
          source={require('./../../assets/images/account_balance_wallet_30dp_FF5A00_FILL0_wght400_GRAD0_opsz24.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Balance</Text>
          {/* Display balance or a loading indicator */}
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.balance}>
              {typeof balance === 'number' ? balance.toFixed(2) : 'Unavailable'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 25,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    color: '#ff5a00',
    fontWeight: 'bold',
    marginBottom: 5, 
    fontFamily: 'Oswald',
  },
  balance: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
  image1: {
    width: 50,
    height: 50,
  },
});
