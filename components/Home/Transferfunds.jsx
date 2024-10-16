import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/firebaseConfig'; // Ensure you import Firebase Auth
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  runTransaction, 
  addDoc, 
  where, 
  query 
} from 'firebase/firestore';



export default function Transferfunds() {
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState(null);

  // Get the current user's email when the component mounts
  React.useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setSenderEmail(user.email);
      } else {
        Alert.alert('Error', 'No authenticated user found.');
      }
    });
  }, []);

  const handleSendPress = async () => {
    const amountNum = parseFloat(amount);
  
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount');
      return;
    }
  
    if (!senderEmail) {
      Alert.alert('Error', 'Sender not authenticated');
      return;
    }
  
    // Convert emails to lowercase for case-insensitive comparison
    const lowerSenderEmail = senderEmail.toLowerCase();
    const lowerReceiverEmail = email.toLowerCase();
  
    try {
      const senderQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', lowerSenderEmail));
      const receiverQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', lowerReceiverEmail));
  
      const senderSnapshot = await getDocs(senderQuery);
      const receiverSnapshot = await getDocs(receiverQuery);
  
      if (senderSnapshot.empty || receiverSnapshot.empty) {
        Alert.alert('Error', 'Sender or Receiver not found');
        return;
      }
  
      const senderDoc = senderSnapshot.docs[0];
      const receiverDoc = receiverSnapshot.docs[0];
  
      const senderData = senderDoc.data();
      const receiverData = receiverDoc.data();
  
      if (senderData.balance < amountNum) {
        Alert.alert('Insufficient Funds', 'You do not have enough balance for this transfer');
        return;
      }
  
      await runTransaction(FIRESTORE_DB, async (transaction) => {
        const newSenderBalance = senderData.balance - amountNum;
        const newReceiverBalance = receiverData.balance + amountNum;
  
        transaction.update(senderDoc.ref, { balance: newSenderBalance });
        transaction.update(receiverDoc.ref, { balance: newReceiverBalance });
      });
  
      await addDoc(collection(FIRESTORE_DB, 'Transactions'), {
        amount: amountNum,
        senderId: senderDoc.id,
        receiverId: receiverDoc.id,
        status: 'completed',
        timestamp: new Date()
      });
  
      Alert.alert('Success', 'Funds transferred successfully');
      setSendModalVisible(false);
      setAmount(''); 
      setEmail(''); 
    } catch (error) {
      console.error("Transaction failed: ", error);
      Alert.alert('Error', 'There was a problem processing your transaction');
    }
  };
  

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Transférer des fonds</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setSendModalVisible(true)}>
          <Text style={styles.buttonText}>Envoyer des fonds</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Envoyer des fonds</Text>

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
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
              color="#000"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setSendModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Oswald',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#ff5a00',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
