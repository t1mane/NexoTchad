import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Tablayout() {
  return (
    <Tabs screenOptions={{headerShown: false}}>
      <Tabs.Screen name='home'
      options={{
        tabBarLabel: 'Home',
        tabBarIcon:({color})=><FontAwesome name="home" size={24} color={color} />
      }}
      />
      <Tabs.Screen name='Recent'options={{
        tabBarLabel: 'Recent',
        tabBarIcon:({color})=><MaterialIcons name="history" size={24} color={color} />
      }}/>


    </Tabs>
  )
}