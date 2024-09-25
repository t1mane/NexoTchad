import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";


export default function Index() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "orange",
      }}
    >
      <Text>Nexo</Text>
    </SafeAreaView>
  );
}
