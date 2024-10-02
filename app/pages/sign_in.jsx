import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Make sure expo-router is properly installed
import { Colors } from '@/constants/Colors'; // Ensure this is correctly imported

export default function SignInScreen() {
  return (
    <View style={styles.container}>
      
      {/* Logo Section */}
      <Image 
        source={require('./../../assets/images/Orange_copy 2.png')} // Adjusted image path and renamed file
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Connectez-vous à votre compte</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="account number"
          style={styles.input}
        />
        <TextInput
          placeholder="password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>oublie mot de passe?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>se connecter</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator}>
        <Text style={styles.separatorText}>or</Text>
      </View>

      {/* Sign Up Button */}
      <Link href="/sign_up" style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>créer un compte</Text>
      </Link>

      {/* Language Selection */}
      <View style={styles.languageContainer}>
        <Text style={styles.language}>English</Text>
        <Text style={styles.language}>Français</Text>
        <Text style={styles.language}>عربي</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 80,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  forgotPassword: {
    color: Colors.Primary, 
    textAlign: "right",
    marginBottom: 20,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: Colors.Primary, 
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  signInButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  separatorText: {
    color: "#aaa",
    paddingHorizontal: 10,
    fontSize: 14,
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
    justifyContent: "space-between",
    marginTop: 20,
  },
  language: {
    color: "#333",
    fontSize: 14,
  },
});
