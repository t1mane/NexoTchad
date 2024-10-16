import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, View, Text, Image, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from './../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserDocument } from '../config/firebaseService'; // adjust the path as necessary

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)" }],
      });
    } catch (error) {
      console.log(error);
      alert('Sign-in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      // Create a Firestore document with user details
      await createUserDocument(response.user);
      alert('Check your emails for verification');
    } catch (error) {
      console.log(error);
      alert('Sign-up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.middleContent}>
          <Image 
            source={require('./../assets/images/Orange_copy 2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            Déposez, transférez et gérez votre argent facilement
          </Text>
          <View style={styles.loginContainer}>
            <TextInput
              value={email}
              style={styles.input}
              placeholder='Email'
              autoCapitalize='none'
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="#888"
              color="#000"
              fontFamily="oswald"
            />
            <TextInput
              secureTextEntry={true}
              value={password}
              style={styles.input}
              placeholder='Password'
              autoCapitalize='none'
              onChangeText={(text) => setPassword(text)}
              placeholderTextColor="#888"
              color="#000"
              fontFamily="oswald"
            />
            {loading ? (
              <ActivityIndicator size='large' color='#0000ff' />
            ) : (
              <>
                <TouchableOpacity style={styles.button} onPress={signIn}>
                  <Text style={styles.buttonText}>Connecter-vous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={signUp}>
                  <Text style={styles.buttonText}>Creer un Compte</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#ff5a00",
  },
  middleContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: -40,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Oswald-Bold',
    textAlign: 'center',
    marginTop: -40,
    fontWeight: "bold",
  },
  loginContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    marginTop: 20,
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%', // Adjusted to be wider
    height: 50,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginVertical: 13,
  },
  button: {
    backgroundColor: '#ff5a00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%', // Make button full-width
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:"Oswald"
  },
});
