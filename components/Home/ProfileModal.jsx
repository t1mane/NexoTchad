import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

export default function ProfileModal({ visible, onClose }) {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [profession, setProfession] = useState('');

  const handleSubmit = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      Alert.alert("Erreur", "Aucun utilisateur authentifié trouvé.");
      return;
    }

    if (!name || !lastName || !age || !sex || !profession) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const profileRef = doc(FIRESTORE_DB, "UserInformation", user.uid);
      await setDoc(profileRef, {
        name,
        lastName,
        age: parseInt(age, 10),
        sex,
        profession
      });
      Alert.alert("Succès", "Informations de profil enregistrées.");
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du profil: ", error);
      Alert.alert("Erreur", "Impossible de sauvegarder les informations du profil.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Complétez votre profil</Text>

            <TextInput 
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput 
              style={styles.input}
              placeholder="Prénom"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput 
              style={styles.input}
              placeholder="Âge"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput 
              style={styles.input}
              placeholder="Sexe"
              value={sex}
              onChangeText={setSex}
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput 
              style={styles.input}
              placeholder="Profession"
              value={profession}
              onChangeText={setProfession}
              placeholderTextColor="#888"
              color="#000"
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
              <Text style={styles.sendButtonText}>Enregistrer le profil</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
