import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get item error:', error);
      return null;
    }
  },
  async saveToken(key, value) {
    return SecureStore.setItemAsync(key, value);
  },
};

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <AuthNavigator setIsAuthenticated={setIsAuthenticated} router={router} />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AuthNavigator({ setIsAuthenticated, router }) {
  const { isSignedIn } = useAuth();

  // app/_layout.jsx - Inside useEffect in AuthNavigator
useEffect(() => {
  if (isSignedIn) {
    setIsAuthenticated(true);
    router.replace("/(tabs)/home"); // Using replace to avoid back navigation to loginscreen
  } else {
    setIsAuthenticated(false);
    router.replace("/loginscreen");
  }
}, [isSignedIn]);

  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: false
      })}
    />
  );
}
