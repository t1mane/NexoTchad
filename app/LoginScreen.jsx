import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { Link } from 'expo-router'; // Import Link for navigation

export default function LoginScreen() {
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
      
      {/* Two buttons for Sign In and Sign Up */}
      <View style={styles.buttonContainer}>
        <Link href="/sign_in" style={[styles.btn, styles.btnSpacing]}>
          <Text style={styles.btnText}>Connecter-vous</Text>
        </Link>

        <Link href="/sign_up" style={styles.btn}>
          <Text style={styles.btnText}>Inscriver-vous</Text>
        </Link>
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
    fontFamily: 'outfit_bold',
    textAlign: 'center',
    marginTop: -30, // Space between the logo and text
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
    fontFamily: 'outfit_bold',
    fontSize: 15,
  },
});
