import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from './../../config/FirebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function ContactsNexo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]);
  const [showAllContacts, setShowAllContacts] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) return;

      setCurrentUser(currentUser);

      try {
        const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setContacts(userData.contacts || []);
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
    if (!name || !lastName || !email) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
  
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Prevent adding self as a contact
      if (normalizedEmail === currentUser.email.toLowerCase()) {
        Alert.alert('Error', 'vous pouver pas etre votre propre contact');
        return;
      }

      const usersRef = collection(FIRESTORE_DB, 'Users');
      const q = query(usersRef, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const contactDoc = querySnapshot.docs[0];
        const contactData = contactDoc.data();
        const contactId = contactDoc.id;
  
        const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        await updateDoc(userRef, {
          contacts: arrayUnion({
            contactId,
            name,
            lastName,
            email: normalizedEmail,  // Store email in lowercase
          }),
        });
  
        setContacts((prevContacts) => [
          ...prevContacts,
          { contactId, name, lastName, email: normalizedEmail }, // Store email in lowercase for the state
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
    if (!selectedContact) return;

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

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

  const handleContactPress = (contact) => {
    setSelectedContact(contact);
    setContactModalVisible(true);
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

  const visibleContacts = showAllContacts ? contacts : contacts.slice(0, 9);

  return (

    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      
      <View style={styles.contactsBox}>
        {visibleContacts.map((contact, index) => (
          <TouchableOpacity key={index} style={styles.contactCircle} onPress={() => handleContactPress(contact)}>
            <Text style={styles.contactText}>{contact.name[0]}{contact.lastName[0]}</Text>
          </TouchableOpacity>
        ))}
        {contacts.length > 9 && !showAllContacts && (
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowAllContacts(true)}>
            <Text style={styles.dropdownButtonText}>Voir tous les contacts ▼</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.addContactCircle} onPress={handleAddContact}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Creating Contact */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
            <Text style={styles.modalTitle}>Créer un Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
              color="#000"
              fontFamily="oswald"
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#888"
              color="#000"
              fontFamily="oswald"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
              color="#000"
              fontFamily="oswald"
            />
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

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={() => console.log('Transfer Funds')}>
                    <Text style={styles.buttonText}>Transférer des fonds</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => console.log('Request Funds')}>
                    <Text style={styles.buttonText}>Demander des fonds</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Delete Contact Button */}
                <TouchableOpacity style={[styles.Deletebutton, { backgroundColor: 'red' }]} onPress={handleDeleteContact}>
                  <Text style={styles.DeletebuttonText}>Supprimer le Contact</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8, alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Oswald-Bold' },
  contactsBox: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, alignItems: 'center', width: '100%' },
  contactCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 },
  addContactCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4caf50', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 },
  addText: { fontSize: 20, fontWeight: 'bold', color: '#fff', fontFamily: "oswald" },
  dropdownButton: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#ddd', borderRadius: 5 },
  dropdownButtonText: { color: '#555', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Oswald-Bold' },
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
  Deletebutton: {
    backgroundColor: '#fff', // White background for delete button
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
    borderColor: 'red', // Optional: add a red border if desired
    borderWidth: 1,
    marginTop:20
  },
  DeletebuttonText: {
    color: '#fff', // Red text color for delete button
    fontSize: 15,
    fontFamily: 'Oswald',
    fontWeight: 'bold',
  },
});
