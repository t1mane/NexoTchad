import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Link } from "expo-router"; // Make sure expo-router is properly installed
import { Colors } from '@/constants/Colors'; // Ensure this is correctly imported
import {useRouter } from 'expo-router'; // Import Link for navigation

export default function SignInScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      
      {/* Logo Container with background */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('./../../assets/images/Orange_copy 2.png')} // Adjusted image path and renamed file
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Connectez-vous à votre compte</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Numero de Compte"
          placeholderTextColor="#9AA0A6"
          style={styles.input}
        />
        <TextInput
          placeholder="password"
          secureTextEntry
          placeholderTextColor="#9AA0A6"
          style={styles.input}
        />
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>oublie mot de passe?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.signInButton}
      onPress={() => router.push('(tabs)/home')}
      >
        <Text style={styles.signInButtonText}>se connecter</Text>
      </TouchableOpacity>

      {/* Separator */}
      <View style={styles.separator}>
        <Text style={styles.separatorText}>or</Text>
      </View>

      {/* Sign Up Button */}
      <Link href="pages/sign_up" style={styles.signUpButton}>
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
    justifyContent: "flex-start", // Ensure content starts at the top
  },
  logoContainer: {
    backgroundColor: Colors.Primary, // Orange background (assuming Colors.Primary is your orange color)
    width: '110%', // Full width of the screen
    height: 100,   // Adjust height as needed to cover the top part
    justifyContent: 'center', // Center logo vertically within the container
    alignItems: 'center',     // Center logo horizontally within the container
    marginBottom: 30,         // Add space between the logo container and the rest of the content
  },
  logo: {
    width: 150,    // Adjust logo width
    height: 100,   // Adjust logo height
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
