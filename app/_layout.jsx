// app/_layout.jsx
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Stack, useRouter } from 'expo-router';
import { FIREBASE_AUTH } from './../config/FirebaseConfig';
import LoginScreen from './LoginScreen';
import { useFonts } from 'expo-font';

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Load custom fonts
  useFonts({
    'Oswald': require('./../assets/fonts/Oswald-Regular.ttf'),
    'Oswald-Medium': require('./../assets/fonts/Oswald-Medium.ttf'),
    'Oswald-Bold': require('./../assets/fonts/Oswald-Bold.ttf'),
  });

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        setIsAuthenticated(true);
        router.replace('/(tabs)/home'); // Replace stack to prevent back navigation
      } else {
        setIsAuthenticated(false);
        router.replace('/LoginScreen'); // Replace stack to prevent back navigation
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
