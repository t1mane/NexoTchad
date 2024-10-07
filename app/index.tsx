// app/index.tsx
import { Stack } from "expo-router";
import 'react-native-url-polyfill/auto';

export default function Index() {
  return (
    <Stack>
      <Stack.Screen name="loginscreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)/home" options={{ title: "Home" }} />
      <Stack.Screen name="(tabs)/recent" options={{ title: "Recent Activity" }} />
    </Stack>
  );
}
