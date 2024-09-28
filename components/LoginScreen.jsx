import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Centered logo and text */}
      <View style={styles.middleContent}>
        <Image 
          source={require('./../assets/images/Orange_copy 2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Text under the logo */}
        <Text style={styles.subtitle}>
          Déposez, transférez et gérez votre argent facilement.
        </Text>
      </View>
      
      {/* Button at the bottom */}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Se Connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container with background color matching the image
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.Primary, // Matching background color with the image
  },
  
  // Centered content for logo and text
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Logo styling
  logo: {
    width: 250, // Increase the size of the logo
    height: 250,
  },
  
  // Subtitle text under the logo
  subtitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'outfit_bold',
    textAlign: 'center',
    marginTop:-30, // Space between logo and text
    fontSize:18
  },
  
  // Button style at the bottom
  btn: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 99,
    marginBottom: 40, // Move the button closer to the bottom of the screen
    width: '70%',
    alignSelf: 'center',
  },
  
  // Button text style with primary orange color
  btnText: {
    textAlign: 'center',
    color: Colors.Primary,
    fontFamily: 'outfit_bold',
    fontSize: 15,
  },
});
