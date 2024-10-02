import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";  // Added the Link import
import { Colors } from '@/constants/Colors'; // Ensure this is correctly imported


export default function SignUpScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo section at the top */}
        <View style={styles.logoContainer}>
          <Image
            source={require('./../../assets/images/Orange_copy 2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Crée un compte</Text>

        {/* Input fields */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Prénom"
            placeholderTextColor="#9AA0A6" // Set to black explicitly
            style={styles.input}
          />
          <TextInput
            placeholder="Nom de Famille"
            placeholderTextColor="#9AA0A6" // Set to black explicitly
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#9AA0A6" // Set to black explicitly
            style={styles.input}
          />
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9AA0A6" // Set to black explicitly
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Confirmer mot de passe"
            placeholderTextColor="#9AA0A6" // Set to black explicitly
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* "Créer un compte" button */}
        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.createAccountButtonText}>Créer un compte</Text>
        </TouchableOpacity>

        {/* Add navigation back to Sign In */}
        <Link href="/sign_in" style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Déjà un compte? Connectez-vous</Text>
        </Link>

        {/* Language options */}
        <View style={styles.languageContainer}>
          <Text style={styles.language}>English</Text>
          <Text style={styles.language}>Français</Text>
          <Text style={styles.language}>عربي</Text>
        </View>
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
  },
  logoContainer: {
    alignSelf: 'flex-start', // Align logo to the top-left of the screen
    marginTop: 100,           // Add some margin to the top of the logo
    marginBottom: 30,        // Space between logo and title
  },
  logo: {
    width: 350,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000", // Explicitly setting text color to black when typing
  },
  signupButton: {
    backgroundColor: Colors.primary, // Assuming you have Colors.primary defined as orange
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  createAccountButton: {
    borderColor: Colors.Primary,
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: Colors.Primary // Corrected to apply Colors.primary for background
  },
  createAccountButtonText: {
    color: "#fff", // White text for the button to contrast with the orange background
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpButton: {
    borderColor: Colors.Primary,
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  signUpButtonText: {
    textAlign: "center",
    color: Colors.Primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  language: {
    fontSize: 14,
    color: Colors.darkGray, // Assuming you have Colors.darkGray defined
  },
});
