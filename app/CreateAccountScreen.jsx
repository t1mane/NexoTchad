import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './../config/FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { createUserDocument } from '../config/firebaseService';

export default function CreateAccountScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const signUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      // Create the user account
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      // Save user data in Firestore
      try {
        await createUserDocument(response.user);
      } catch (error) {
        console.error('Error creating user document:', error);
        Alert.alert('Erreur', 'Un problème est survenu lors de la création de votre compte.');
      }

      // Send email verification
      try {
        await sendEmailVerification(response.user);
        Alert.alert(
          'Succès',
          'Compte créé avec succès ! Veuillez vérifier votre email. Connectez-vous après avoir vérifié votre email.'
        );

        // Redirect to login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }], // Replace with your login screen's name
        });
      } catch (error) {
        console.error('Error sending email verification:', error);
        Alert.alert('Erreur', 'Impossible d’envoyer l’email de vérification.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Erreur', `Échec de l'inscription : ${error.message}`);
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.middleContent}>
            <Image
              source={require('./../assets/images/Orange_copy 2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>Créez votre compte pour commencer</Text>
            <View style={styles.loginContainer}>
              <TextInput
                value={email}
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor="#888"
                color="#000"
                fontFamily="oswald"
              />
              <TextInput
                secureTextEntry={true}
                value={password}
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor="#888"
                color="#000"
                fontFamily="oswald"
              />
              <TextInput
                secureTextEntry={true}
                value={confirmPassword}
                style={styles.input}
                placeholder="Confirmez le mot de passe"
                autoCapitalize="none"
                onChangeText={(text) => setConfirmPassword(text)}
                placeholderTextColor="#888"
                color="#000"
                fontFamily="oswald"
              />
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Créer un Compte</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LoginScreen')}
                  >
                    <Text style={styles.buttonText}>Vous avez déjà un compte ?</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ff5a00',
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
    fontFamily: 'oswald-Bold',
    textAlign: 'center',
    marginTop: -40,
    fontWeight: 'bold',
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
    width: '100%',
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
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },
});
