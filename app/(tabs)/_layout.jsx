// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import { View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff5a00",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="Recent" 
        options={{ 
          title: "Activities", 
          tabBarIcon: ({ color }) => <MaterialIcons name="history-toggle-off" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="scan" 
        options={{ 
          title: "Scan", 
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                width: 70, // Larger width
                height: 70, // Larger height
                borderRadius: 35, // Make it circular
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff', // Optional background to make it stand out
                marginBottom: 10, // Push it slightly up
              }}
            >
              <AntDesign name="qrcode" size={36} color="black" />
            </View>
          ),
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: "Notifications", 
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}
