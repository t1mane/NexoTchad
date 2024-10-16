import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../config/firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export default function ContactsNexo() {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contacts, setContacts] = useState([]); // Array to hold contacts

  // Fetch contacts from Firestore when the component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;

      if (!currentUser) return;

      try {
        const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setContacts(userData.contacts || []); // Set contacts or default to empty array
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        Alert.alert('Error', 'Unable to fetch contacts. Please try again later.');
      }
    };

    fetchContacts();
  }, []); // Empty dependency array ensures this only runs on mount

  const handleAddContact = () => {
    setModalVisible(true);
  };

  const handleSaveContact = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const normalizedEmail = email.trim().toLowerCase(); // Convert email to lowercase and trim whitespace
      const usersRef = collection(FIRESTORE_DB, 'Users');
      const q = query(usersRef, where('email', '==', normalizedEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const contactDoc = querySnapshot.docs[0]; // Assuming one unique user per email
        const contactData = contactDoc.data();
        const contactId = contactDoc.id;

        // Add the contact to the current user's contacts array
        const userRef = doc(FIRESTORE_DB, 'Users', currentUser.uid);
        await updateDoc(userRef, {
          contacts: arrayUnion({
            contactId,
            name,
            lastName,
            email: contactData.email, // Store email in consistent lowercase form
          }),
        });

        // Update the local contacts state to reflect the new contact
        setContacts((prevContacts) => [
          ...prevContacts,
          { name, lastName, email: contactData.email },
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

  const closeModal = () => {
    setModalVisible(false);
    setName('');
    setLastName('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      
      <View style={styles.contactsBox}>
        <View style={styles.contactRow}>
          {contacts.map((contact, index) => (
            <View key={index} style={styles.contactCircle}>
              <Text style={styles.contactText}>{contact.name[0]}{contact.lastName[0]}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.addContactCircle} onPress={handleAddContact}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Creating Contact */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
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
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Oswald-Bold',
  },
  contactsBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactCircle: {
    width: 60,           // Larger width for contact circles
    height: 60,          // Larger height for contact circles
    borderRadius: 30,    // Half of the width/height for a circular shape
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  addContactCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  addText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily:"oswald"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily:"oswald"
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000', // Ensures text within input fields is black
  },
  saveButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:'oswald'
  },
});
