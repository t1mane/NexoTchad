import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs  
      options={{ headerShown: false, title: "" }}
      screenOptions={{
        tabBarActiveTintColor: "#ff5a00",
        tabBarInactiveTintColor: "gray", // Optionally, you can specify the inactive color too
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home", 
          headerShown: false, 
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="recent" 
        options={{ 
          title: "Activities", 
          headerShown: false, 
          tabBarIcon: ({ color }) => <MaterialIcons name="history-toggle-off" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: "Scan", 
          headerShown: false, 
          tabBarIcon: ({ color }) => <Ionicons name="scan" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications", 
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile", 
          headerShown: false, 
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
