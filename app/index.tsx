import { Stack } from "expo-router";
import 'react-native-url-polyfill/auto'

export default function Index() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="recent" options={{ title: "Recent Activity" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
    </Stack>
  );
}
