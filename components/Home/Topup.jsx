import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firebaseApp } from './../../config/FirebaseConfig'; // Import Firebase config

export default function Topup({ navigation }) {
  const [scratchCode, setScratchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  const handleTopUpPress = async () => {
    if (!scratchCode) {
      Alert.alert('Erreur', 'Veuillez entrer un code de recharge');
      return;
    }

    setLoading(true);
    try {
      const scratchCardRef = doc(db, 'scratch_cards', scratchCode);
      const scratchCardSnap = await getDoc(scratchCardRef);

      if (!scratchCardSnap.exists()) {
        Alert.alert('Erreur', 'Code de recharge invalide');
      } else {
        const scratchCardData = scratchCardSnap.data();

        if (scratchCardData.used) {
          Alert.alert('Erreur', 'Ce code de recharge a déjà été utilisé.');
        } else {
          const user = auth.currentUser;
          const userRef = doc(db, 'Users', user.uid); // 'Users' collection
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const newBalance = (userData.balance || 0) + scratchCardData.amount;

            // Update user's balance and mark the scratch card as used
            await updateDoc(userRef, { balance: newBalance });
            await updateDoc(scratchCardRef, { used: true });

            Alert.alert('Succès', `Votre compte a été rechargé de ${scratchCardData.amount} unités!`);
            setModalVisible(false); // Close the modal after successful top-up
          } else {
            Alert.alert('Erreur', "Utilisateur non trouvé");
          }
        }
      }
    } catch (error) {
      console.error('Erreur pendant la recharge :', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la recharge.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Recharger votre compte</Text>
      <View style={styles.buttonContainer}>
        {/* Button to open the modal */}
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Recharger</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for entering scratch card code */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Close modal on hardware back button press
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Entrez le code de recharge</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Code de recharge"
                  value={scratchCode}
                  onChangeText={setScratchCode}
                  returnKeyType="done" // To allow closing the keyboard on done
                />
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleTopUpPress} disabled={loading}>
                    <Text style={styles.buttonText}>Soumettre</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: 'Oswald-Bold',
    fontSize: 17,
    marginTop: 25,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Oswald',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim the background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Oswald-Bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    width: '100%',
    marginVertical: 10,
    borderRadius: 5,
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
