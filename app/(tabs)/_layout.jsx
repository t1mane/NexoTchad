import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs  options={{headerShown: false, title: ""}}>
      <Tabs.Screen name="home" options={{ title: "Home" , headerShown: false}} />
      <Tabs.Screen name="recent" options={{ title: "Activities", headerShown:  false}} />
    </Tabs>
  );
}
