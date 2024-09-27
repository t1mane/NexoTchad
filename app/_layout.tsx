import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {
  useFonts({
    'outfit' :require('./../assets/fonts/Roboto-Regular.ttf')
  })
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown :false
      }
      } />
    </Stack>
  );
}
