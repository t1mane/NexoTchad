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
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startMicrosoftOAuthFlow } = useOAuth({ strategy: 'oauth_microsoft' });
  const router = useRouter(); 

  // app/loginscreen.jsx - Modify both callbacks for onPressGoogle and onPressMicrosoft
const onPressGoogle = useCallback(async () => {
  try {
    const { createdSessionId } = await startGoogleOAuthFlow({
      redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
    });
    if (createdSessionId) {
      router.replace('/(tabs)/home'); // Replace instead of push
    }
  } catch (err) {
    console.error('Google OAuth error', err);
  }
}, [router]);

const onPressMicrosoft = useCallback(async () => {
  try {
    const { createdSessionId } = await startMicrosoftOAuthFlow({
      redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
    });
    if (createdSessionId) {
      router.replace('/(tabs)/home'); // Replace instead of push
    }
  } catch (err) {
    console.error('Microsoft OAuth error', err);
  }
}, [router]);


  return (
    <View style={styles.container}>
      <View style={styles.middleContent}>
        <Image 
          source={require('./../assets/images/Orange_copy 2.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          Déposez, transférez et gérez votre argent facilement
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.btn, styles.btnSpacing]}
          onPress={onPressGoogle} 
        >
          <Text style={styles.btnText}>Login Using Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={onPressMicrosoft}
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
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Oswald-Bold',
    textAlign: 'center',
    marginTop: -30, 
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
    width: '70%',
    alignSelf: 'center',
  },
  btnSpacing: {
    marginBottom: 20, 
  },
  btnText: {
    textAlign: 'center',
    color: Colors.Primary,
    fontFamily: 'outfit_Bold',
    fontSize: 15,
    fontWeight: "bold",
  },
});
