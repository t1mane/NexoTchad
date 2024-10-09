import { View, Text, ActivityIndicator, Image } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';

export default function Header() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        // Display a loading indicator while user data is loading
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#ff5a00" />
            </View>
        );
    }

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 25
        }}>
            <View>
                <Text style={{ fontFamily: 'Oswald-Bold', fontSize: 18 }}>Bienvenue,</Text>
                <Text style={{ fontFamily: "Oswald", fontSize: 20, color: "#ff5a00" }}>
                    {user?.fullName}
                </Text>
            </View>
            <Image source={{ uri: user?.imageUrl }} style={{
                width: 40,
                height: 40,
                borderRadius: 99,
            }} />
        </View>
    );
}
