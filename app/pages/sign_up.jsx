import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from "react-native";
import { useRouter } from 'expo-router'; // For navigation
import { createUser } from './../../lib/appwrite'; // Assuming createUser is defined properly

export default function SignUpScreen() {
  const router = useRouter();

  // Local state to capture user input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Function to handle user sign-up
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await createUser(email, password, `${firstName} ${lastName}`);
      console.log('User successfully created:', response);
      router.push('(tabs)/home'); // Navigate to home screen after sign up
    } catch (error) {
      Alert.alert('Sign-up Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo section */}
        <View style={styles.logoContainer}>
          <Image
            source={require('./../../assets/images/Orange_copy 2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Créez un compte</Text>

        {/* Input fields */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Prénom"
            placeholderTextColor="#9AA0A6"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Nom de famille"
            placeholderTextColor="#9AA0A6"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9AA0A6"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9AA0A6"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirmer mot de passe"
            placeholderTextColor="#9AA0A6"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* "Créer un compte" button */}
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={handleSignUp}
        >
          <Text style={styles.createAccountButtonText}>Créer un compte</Text>
        </TouchableOpacity>

        {/* Navigate back to Sign In */}
        <TouchableOpacity
          style={styles.createAccountButton2}
          onPress={() => router.push('pages/sign_in')}
        >
          <Text style={styles.createAccountButton2Text}>j'ai deja un compte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  createAccountButton: {
    backgroundColor: "#FF6600", // Orange color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  createAccountButton2: {
    borderColor: "#FF6600",
    borderWidth: 2,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  createAccountButton2Text: {
    color: "#FF6600",
    fontSize: 16,
    fontWeight: "bold",
  },
});
