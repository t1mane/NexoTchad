import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove, runTransaction, addDoc } from 'firebase/firestore';

export default function ContactsNexo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [amount, setAmount] = useState('');
  const [senderEmail, setSenderEmail] = useState(null);
  const [showAllContacts, setShowAllContacts] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) {
        console.log('No authenticated user.');
        return;
      }
      setSenderEmail(user.email);

      try {
        const userRef = doc(FIRESTORE_DB, 'Users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setContacts(userDoc.data().contacts || []);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Unable to fetch contacts. Please try again later.');
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = () => {
    setModalVisible(true);
  };

  const handleSaveContact = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!name || !lastName || !email) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === currentUser.email.toLowerCase()) {
      Alert.alert('Error', 'vous ne pouvez pas être votre propre contact');
      return;
    }

    try {
      const usersRef = collection(FIRESTORE_DB, 'Users');
      const q = query(usersRef, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const contactDoc = querySnapshot.docs[0];
        const contactId = contactDoc.id;

        const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        await updateDoc(userRef, {
          contacts: arrayUnion({ contactId, name, lastName, email: normalizedEmail }),
        });

        setContacts((prevContacts) => [
          ...prevContacts,
          { contactId, name, lastName, email: normalizedEmail },
        ]);

        Alert.alert('Success', 'Contact added successfully!');
        closeModal();
      } else {
        Alert.alert('Error', 'No user found with that email');
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      Alert.alert('Error', 'Unable to add contact. Please try again later.');
    }
  };

  const handleDeleteContact = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    if (!selectedContact) return;

    try {
      const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
      await updateDoc(userRef, {
        contacts: arrayRemove(selectedContact),
      });

      setContacts((prevContacts) => 
        prevContacts.filter(contact => contact.contactId !== selectedContact.contactId)
      );

      Alert.alert('Success', 'Contact deleted successfully!');
      closeContactModal();
    } catch (error) {
      console.error("Error deleting contact:", error);
      Alert.alert('Error', 'Unable to delete contact. Please try again later.');
    }
  };

  const handleTransferFunds = () => {
    setContactModalVisible(false);
    setTransferModalVisible(true);
  };

  const handleSendPress = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount');
      return;
    }

    if (!senderEmail || !selectedContact) {
      Alert.alert('Error', 'Invalid transaction information');
      return;
    }

    try {
      const senderQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', senderEmail));
      const receiverQuery = query(collection(FIRESTORE_DB, 'Users'), where('email', '==', selectedContact.email.toLowerCase()));

      const senderSnapshot = await getDocs(senderQuery);
      const receiverSnapshot = await getDocs(receiverQuery);

      if (senderSnapshot.empty || receiverSnapshot.empty) {
        Alert.alert('Error', 'envoyeur ou receveur pas trouver');
        return;
      }

      const senderDoc = senderSnapshot.docs[0];
      const receiverDoc = receiverSnapshot.docs[0];
      const senderData = senderDoc.data();

      if (senderData.balance < amountNum) {
        Alert.alert('fond insuffisent', 'vous avez pas assez de fonds pour ce transfer');
        return;
      }

      await runTransaction(FIRESTORE_DB, async (transaction) => {
        transaction.update(senderDoc.ref, { balance: senderData.balance - amountNum });
        transaction.update(receiverDoc.ref, { balance: receiverDoc.data().balance + amountNum });
      });

      await addDoc(collection(FIRESTORE_DB, 'Transactions'), {
        amount: amountNum,
        senderId: senderDoc.id,
        receiverId: receiverDoc.id,
        status: 'completed',
        timestamp: new Date()
      });

      Alert.alert('Success', 'Funds transferred successfully');
      setTransferModalVisible(false);
      setAmount('');
    } catch (error) {
      console.error("Transaction failed: ", error);
      Alert.alert('Error', 'There was a problem processing your transaction');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setName('');
    setLastName('');
    setEmail('');
  };

  const closeContactModal = () => {
    setContactModalVisible(false);
    setSelectedContact(null);
  };

  const closeTransferModal = () => {
    setTransferModalVisible(false);
    setAmount('');
  };

  const visibleContacts = showAllContacts ? contacts : contacts.slice(0, 8);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>

      <View style={styles.contactsBox}>
        {/* First Row */}
        <View style={styles.shelf}>
          {visibleContacts.slice(0, 4).map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactCircle} onPress={() => { setSelectedContact(contact); setContactModalVisible(true); }}>
              <Text style={styles.contactText}>{contact.name[0]}{contact.lastName[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Second Row */}
        <View style={styles.shelf}>
          {visibleContacts.slice(4, 8).map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactCircle} onPress={() => { setSelectedContact(contact); setContactModalVisible(true); }}>
              <Text style={styles.contactText}>{contact.name[0]}{contact.lastName[0]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add contact button */}
        <TouchableOpacity style={styles.addContactCircle} onPress={handleAddContact}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>

        {/* Button to show more contacts if there are more than 8 */}
        {contacts.length > 8 && !showAllContacts && (
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowAllContacts(true)}>
            <Text style={styles.dropdownButtonText}>Voir tous les contacts ▼</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Scrollable Section for additional contacts */}
      {showAllContacts && (
        <ScrollView style={styles.moreContacts}>
          <View style={styles.shelf}>
            {contacts.slice(8).map((contact, index) => (
              <TouchableOpacity key={index} style={styles.contactCircle} onPress={() => { setSelectedContact(contact); setContactModalVisible(true); }}>
                <Text style={styles.contactText}>{contact.name[0]}{contact.lastName[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowAllContacts(false)}>
            <Text style={styles.dropdownButtonText}>Masquer les contacts ▲</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal for Creating Contact */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.modalTitle}>Créer un Contact</Text>
            <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Prénom" value={lastName} onChangeText={setLastName} placeholderTextColor="#888" />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#888" />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
              <Text style={styles.saveButtonText}>Enregistrer le Contact</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal for Contact Details */}
      <Modal animationType="slide" transparent={true} visible={contactModalVisible} onRequestClose={closeContactModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeContactModal}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            {selectedContact && (
              <>
                <Text style={styles.modalTitle}>Détails du Contact</Text>
                <Text style={styles.contactDetailsText}>Nom: {selectedContact.name}</Text>
                <Text style={styles.contactDetailsText}>Prénom: {selectedContact.lastName}</Text>
                <Text style={styles.contactDetailsText}>Email: {selectedContact.email}</Text>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={handleTransferFunds}>
                    <Text style={styles.buttonText}>Transférer des fonds</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={[styles.Deletebutton, { backgroundColor: 'red' }]} onPress={handleDeleteContact}>
                  <Text style={styles.DeletebuttonText}>Supprimer le Contact</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal for Transferring Funds */}
      <Modal animationType="slide" transparent={true} visible={transferModalVisible} onRequestClose={closeTransferModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Envoyer des fonds à {selectedContact?.name}</Text>
            <TextInput style={styles.input} placeholder="Montant" value={amount} onChangeText={setAmount} keyboardType="numeric" placeholderTextColor="#888" />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeTransferModal}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Oswald-Bold' },
  contactsBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, width: '100%' },
  shelf: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  contactCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
  addContactCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4caf50', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 },
  addText: { fontSize: 20, fontWeight: 'bold', color: '#fff', fontFamily: "oswald" },
  dropdownButton: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#ddd', borderRadius: 5 },
  dropdownButtonText: { color: '#555', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Oswald-Bold' },
  moreContacts: { maxHeight: 200, marginTop: 10 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 350, padding: 40, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily: "oswald" },
  input: { width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginBottom: 10, color: '#000' },
  saveButton: { backgroundColor: '#ff5a00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center', fontFamily: 'oswald' },
  contactDetailsText: { fontSize: 16, marginVertical: 5, fontFamily: 'oswald' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { flex: 1, backgroundColor: '#ff5a00', paddingVertical: 15, marginHorizontal: 5, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontFamily: 'Oswald' },
  sendButton: { backgroundColor: '#ff5a00', paddingVertical: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 15 },
  cancelButtonText: { color: '#ff5a00', fontSize: 16, fontWeight: 'bold' },
  Deletebutton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
    marginTop:20
  },
  DeletebuttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
  },
});
