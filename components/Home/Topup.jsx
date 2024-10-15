import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native';

export default function Topup() {
    const handleEnvoyerPress = () => {
        console.log('Envoyer Button Pressed');
      };
    
      const handleRecevoirPress = () => {
        console.log('Recevoir Button Pressed');
      };
    
      return (
        <View style={styles.outerContainer}>
          <Text style={styles.title}>Recharger</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleEnvoyerPress}>
              <Text style={styles.buttonText}>Recharger</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      outerContainer: {
        marginTop: -20,
        paddingHorizontal: 10, // Ensure the container has space from the sides
      },
      title: {
        marginBottom: 0, // Adjust spacing below the title
        fontFamily: 'Oswald-Bold',
        fontSize: 17,
        textAlign: 'left',
        marginTop: 25,
        // alignContent: 'flex-start'  // Uncomment or remove this line based on your needs
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribute buttons evenly
        marginTop: 20,
      },
      button: {
        flex: 1,
        backgroundColor: '#ff5a00',
        paddingVertical: 10,
        marginHorizontal: 5, // Space between the buttons
        borderRadius: 5,
        alignItems: 'center', // Center text within the button
      },
      buttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: 'Oswald',
      },
    });
    