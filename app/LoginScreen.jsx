import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Colors } from '@/constants/Colors';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { useCallback } from 'react';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const router = useRouter(); // Initialize the router

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
      })

      if (createdSessionId) {
        // If the session was successfully created, redirect to the home page
        router.push('/(tabs)/home'); // Redirect to the home page after login
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, [router]);


  return (
    <View style={styles.container}>
      <View style={styles.middleContent}>
        <Image 
          source={require('./../assets/images/Orange_copy 2.png')} // Ensure correct image path
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Déposez, transférez et gérez votre argent facilement.
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSpacing]}
          onPress={onPress} // Trigger Google login
        >
          <Text style={styles.btnText}>Login Using Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => {}} // Placeholder for Microsoft login
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
