// app/index.tsx
import { Stack } from "expo-router";
import 'react-native-url-polyfill/auto';

export default function Index() {
  return (
    <Stack>
      <Stack.Screen name="loginscreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/home" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="(tabs)/recent" options={{ title: "Recent Activity" }} />
      <Stack.Screen name="(tabs)/notifications" options={{ title: "Nottifications" }} />
      <Stack.Screen name="(tabs)/scan" options={{ title: "Scan" }} />
      <Stack.Screen name="(tabs)/profile" options={{ title: "Profile" }} />
    </Stack>
  );
}
