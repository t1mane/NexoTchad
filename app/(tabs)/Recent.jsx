import { Text, View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function RecentScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9f9" />
      <Text>Recent Activity Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,               // Takes up the full height of the screen
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center',     // Centers content horizontally
    padding: 20,              // Adds padding around the edges
    backgroundColor: '#f3f3f3', // Optional: light background for contrast
  },
});
