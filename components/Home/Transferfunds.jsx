import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, runTransaction, addDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native'; // For accessing route parameters and navigation

export default function Transferfunds({ visible, onClose, email: initialEmail, onTransferSuccess = () => {} }) {
  const route = useRoute();
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState(initialEmail || ''); // Initialize with the passed email
  const [senderEmail, setSenderEmail] = useState(null);

  // Get the current user's email when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setSenderEmail(user.email);
      } else {
        setSenderEmail(null);
        Alert.alert('Erreur', 'Aucun utilisateur authentifié.');
      }
    });

    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email); // Update email from route params (if QR scanned)
    }
  }, [route.params?.email]);

  const handleSendPress = async () => {
    const amountNum = parseFloat(amount);

    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Montant invalide', 'Veuillez entrer un montant valide.');
      return;
    }

    if (!senderEmail) {
      Alert.alert('Erreur', 'Utilisateur non authentifié.');
      return;
    }

    const lowerSenderEmail = senderEmail.toLowerCase();
    const lowerReceiverEmail = email.toLowerCase();

    if (lowerSenderEmail === lowerReceiverEmail) {
      Alert.alert('Erreur', 'Vous ne pouvez pas vous envoyer des fonds.');
      return;
    }

    try {
      // Queries to find sender and receiver in Firestore
      const senderQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', lowerSenderEmail));
      const receiverQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', lowerReceiverEmail));

      const senderSnapshot = await getDocs(senderQuery);
      const receiverSnapshot = await getDocs(receiverQuery);

      if (senderSnapshot.empty || receiverSnapshot.empty) {
        Alert.alert('Erreur', 'Envoyeur ou receveur non trouvé.');
        return;
      }

      const senderDoc = senderSnapshot.docs[0];
      const receiverDoc = receiverSnapshot.docs[0];

      const senderData = senderDoc.data();
      const receiverData = receiverDoc.data();

      if (senderData.balance < amountNum) {
        Alert.alert('Fonds insuffisants', 'Vous n\'avez pas assez de fonds pour effectuer ce transfert.');
        return;
      }

      // Execute the transaction to update sender and receiver balances
      await runTransaction(FIRESTORE_DB, async (transaction) => {
        const newSenderBalance = senderData.balance - amountNum;
        const newReceiverBalance = receiverData.balance + amountNum;

        transaction.update(senderDoc.ref, { balance: newSenderBalance });
        transaction.update(receiverDoc.ref, { balance: newReceiverBalance });
      });

      // Record the transaction in Firestore
      await addDoc(collection(FIRESTORE_DB, 'Transactions'), {
        amount: amountNum,
        senderId: senderDoc.id,
        receiverId: receiverDoc.id,
        status: 'completed',
        timestamp: new Date(),
      });

      Alert.alert('Succès', 'Fonds transférés avec succès.');

      // Reset inputs after successful transfer
      setAmount('');
      setEmail('');

      // Trigger the onTransferSuccess prop function (e.g., close modal and reset stack in HomeScreen)
      if (typeof onTransferSuccess === 'function') {
        onTransferSuccess(); // Safeguard in case onTransferSuccess is not passed
      }
      
    } catch (error) {
      console.error('Transaction échouée : ', error);
      Alert.alert('Erreur', 'Un problème est survenu lors du transfert de fonds.');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Transférer des fonds</Text>

      <TextInput
        style={styles.input}
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholderTextColor="#888"
        color="#000"
      />
      <TextInput
        style={styles.input}
        placeholder="Email du destinataire"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#888"
        color="#000"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: 17,
    textAlign: 'left',
    marginTop: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
  },
  sendButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:"oswald"
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#ff5a00',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'oswald'
  },
});
