import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH } from './../../config/FirebaseConfig';

export default function Header() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Simulate a loading delay for the UI effect
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        
        // Check authentication state and set user
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
            setUser(currentUser);
        }

        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) {
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
                <Text style={{ fontFamily: 'Oswald-Bold', fontSize: 18 }}>
                    {user ? `Bienvenue, ${user.displayName || 'Utilisateur'}` : 'Bienvenue,'}
                </Text>
                <Text style={{ fontFamily: "Oswald", fontSize: 20, color: "#ff5a00" }}>
                    {/* Additional user info or static text can be added here */}
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
