import { Stack } from "expo-router";

export default function Index() {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="recent" options={{ title: "Recent Activity" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="sign_in" options={{ title: "Sign In" }} />
      <Stack.Screen name="sign_up" options={{ title: "Sign Up" }} />
    </Stack>
  );
}
