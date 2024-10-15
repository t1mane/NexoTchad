// app/index.jsx
import { Redirect } from 'expo-router';

export const unstable_settings = {
  exact: true, // Ensures index doesn’t show in navigation
};

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
