import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Redirect } from "expo-router";


export default function Index() {
  return <Redirect href={'/home'}/>
}
