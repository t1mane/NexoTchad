import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Header() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate a loading delay for the UI effect
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
        // Display a loading indicator while data is "loading"
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
                    {/* Additional text can be added here if needed */}
                </Text>
            </View>
            <Image source={{ uri: 'https://placekitten.com/40/40' }} style={{
                width: 40,
                height: 40,
                borderRadius: 20,
            }} />
        </View>
    );
}
