import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text } from 'react-native';
import LoginScreen from './../components/LoginScreen'
import { Slot } from 'expo-router'

export default function RootLayout() {
  useFonts({
    'outfit' :require('./../assets/fonts/Roboto-Regular.ttf'),
    'outfit_bold' :require('./../assets/fonts/Roboto-Bold.ttf'),
    'outfit_Medium' :require('./../assets/fonts/Roboto-Medium.ttf')
    
  })
  return (
  <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
    <SignedIn>
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)"/>
    </Stack>
    </SignedIn> 
    <SignedOut>
      <LoginScreen/>
    </SignedOut>
  </ClerkProvider>
  );
}
