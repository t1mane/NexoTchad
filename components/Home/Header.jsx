import { View, Text, ActivityIndicator, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

export default function Header({ refreshing }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [userName, setUserName] = useState('Utilisateur');

    const fetchUserName = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;

        if (currentUser) {
            const userDocRef = doc(FIRESTORE_DB, 'UserInformation', currentUser.uid);

            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserName(userData.name || 'Utilisateur');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du nom de l'utilisateur : ", error);
            }
        }
        setIsLoaded(true);
    };

    useEffect(() => {
        fetchUserName();
    }, []); // Initial fetch on component mount

    useEffect(() => {
        if (refreshing) {
            setIsLoaded(false);
            fetchUserName(); // Re-fetch when `refreshing` prop changes
        }
    }, [refreshing]); // Dependency on `refreshing`

    if (!isLoaded) {
        return (
            <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#ff5a00" />
            </View>
        );
    }

    return (
        <View style={styles.headerContainer}>
            <Text style={styles.welcomeText}>Bienvenue,</Text>
            <Text style={styles.userNameText}>{userName}</Text>
            <Image source={{ uri: 'https://placekitten.com/40/40' }} style={styles.profileImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 25,
        paddingHorizontal: 20,
    },
    welcomeText: {
        fontFamily: 'Oswald-Bold',
        fontSize: 18,
        color: '#333',
    },
    userNameText: {
        fontFamily: 'Oswald-Bold',
        fontSize: 20, // Slightly larger than "Bienvenue"
        color: '#ff5a00', // Orange color
        marginLeft: 'auto', // Pushes the name to the right side
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
    },
});
