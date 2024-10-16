import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function Transferfunds() {
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  
  // State variables for sending funds
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // State variables for requesting funds
  const [requestAmount, setRequestAmount] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const handleSendPress = () => {
    console.log('Sending funds:', { amount, email, name, lastName });
    setSendModalVisible(false);
    setAmount(''); setEmail(''); setName(''); setLastName('');
  };

  const handleRequestPress = () => {
    console.log('Requesting funds:', { requestAmount, requestEmail, requestMessage });
    setRequestModalVisible(false);
    setRequestAmount(''); setRequestEmail(''); setRequestMessage('');
  };

  return (
    <View style={styles.outerContainer}>
      <Text style={styles.title}>Transférer des fonds</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setSendModalVisible(true)}>
          <Text style={styles.buttonText}>Envoyer des fonds</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => setRequestModalVisible(true)}>
          <Text style={styles.buttonText}>Demander des fonds</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Sending Funds */}
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

            <TouchableOpacity style={styles.sendButton} onPress={handleSendPress}>
              <Text style={styles.sendButtonText}>Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setSendModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Requesting Funds */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={requestModalVisible}
        onRequestClose={() => setRequestModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Demander des fonds</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Montant"
              value={requestAmount}
              onChangeText={setRequestAmount}
              keyboardType="numeric"
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={requestEmail}
              onChangeText={setRequestEmail}
              keyboardType="email-address"
              placeholderTextColor="#888"
              color="#000"
            />
            <TextInput
              style={styles.input}
              placeholder="Message"
              value={requestMessage}
              onChangeText={setRequestMessage}
              placeholderTextColor="#888"
              color="#000"
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleRequestPress}>
              <Text style={styles.sendButtonText}>Demander</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setRequestModalVisible(false)}>
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
