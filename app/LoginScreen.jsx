import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { account } from '../lib/appwrite'; // Import account object from your appwrite config
import { useRouter } from 'expo-router'; // Import useRouter for potential routing

export default function LoginScreen() {
  const router = useRouter();

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        'google', 
        'https://auth.expo.io/@t1mane/NexoTchad', // Development
        'https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/66fe2be200298aebf8b9'
      );
    } catch (error) {
      console.error('Google Login Error:', error.message);
    }
  };
  

  // Function to handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      // Redirect to Microsoft OAuth
      await account.createOAuth2Session('microsoft', 'your-redirect-url-here', 'https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/microsoft/66fe2be200298aebf8b9');
    } catch (error) {
      console.error('Microsoft Login Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Centered logo and text */}
      <View style={styles.middleContent}>
        <Image 
          source={require('./../assets/images/Orange_copy 2.png')} // Ensure the correct image path
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Text under the logo */}
        <Text style={styles.subtitle}>
          Déposez, transférez et gérez votre argent facilement.
        </Text>
      </View>
      
      {/* Two buttons for Sign In with Google and Microsoft */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSpacing]}
          onPress={handleGoogleLogin} // Trigger Google login
        >
          <Text style={styles.btnText}>Login Using Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleMicrosoftLogin} // Trigger Microsoft login
        >
          <Text style={styles.btnText}>Login Using Microsoft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.Primary,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'outfit_Bold',
    textAlign: 'center',
    marginTop: -30, // Space between the logo and text
    fontWeight: "bold",
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 99,
    width: '70%', // Adjust the width so buttons don't take full width and overlap
    alignSelf: 'center',
  },
  btnSpacing: {
    marginBottom: 20, // Add more space between the buttons
  },
  btnText: {
    textAlign: 'center',
    color: Colors.Primary,
    fontFamily: 'outfit_Bold',
    fontSize: 15,
    fontWeight: "bold",
  },
});
