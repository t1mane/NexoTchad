import { StatusBar } from "expo-status-bar";
import { Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={false} backgroundColor="#f9f9f9"/>
      <Text>Welcome to the Notifications screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
});
