import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from './../config/FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSendResetEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(FIREBASE_AUTH, email, {
        url: 'http://localhost:8081/login', // Redirect to login after reset
      });
      setLoading(false);
      Alert.alert(
        'Succès',
        'Un e-mail pour réinitialiser votre mot de passe a été envoyé si cette adresse est enregistrée.'
      );
      navigation.navigate('LoginScreen'); // Redirect back to login
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Erreur', 'Aucun utilisateur trouvé avec cet e-mail.');
      } else {
        Alert.alert('Erreur', error.message);
      }
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
            <Text style={styles.subtitle}>Réinitialisez votre mot de passe</Text>
            <View style={styles.formContainer}>
              <Text style={styles.infoText}>
                Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
              </Text>
              <TextInput
                value={email}
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor="#888"
                color="#000"
              />
              <TouchableOpacity style={styles.button} onPress={handleSendResetEmail}>
                <Text style={styles.buttonText}>
                  {loading ? 'Envoi...' : 'Envoyer le lien'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.backText}>Retour à la connexion</Text>
              </TouchableOpacity>
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
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: -40,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: -40,
    fontWeight: 'bold',
    fontFamily:'oswald'
  },
  formContainer: {
    width: '90%',
    backgroundColor: '#ffffff',
    marginTop: 20,
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily:'oswald'
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
    fontFamily:'oswald'
  },
  backText: {
    color: '#ff5a00',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily:'oswald'
  },
});
