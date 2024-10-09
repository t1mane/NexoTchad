import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'react-native';

export default function Balance() {
  const handlePress = () => {
    // Placeholder for navigation or action
    console.log('Balance component pressed');
  };

  return (
    <TouchableOpacity style={styles.outerContainer} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.container}>
        <Image
          style={styles.image1}
          source={require('./../../assets/images/account_balance_wallet_30dp_FF5A00_FILL0_wght400_GRAD0_opsz24.png')}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Balance</Text>
          {/* Placeholder for balance amount - replace with actual balance value */}
          <Text style={styles.balance}>0.00</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 25,
    alignSelf: 'center',
    width: '100%', // Adjust width as needed
  },
  container: {
    padding: 16,               // Add padding inside the box
    backgroundColor: '#f9f9f9', // Light gray background color
    borderRadius: 10,          // Rounded corners
    borderWidth: 1,            // Border width
    borderColor: '#ddd',       // Border color
    flexDirection: 'row',      // Arrange children in a row
    alignItems: 'center',      // Center items vertically
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3,        // Shadow opacity
    shadowRadius: 4,           // Shadow radius
    elevation: 3,
  },
  textContainer: {
    marginLeft: 20,            // Add space between image and text
  },
  title: {
    fontSize: 18,
    color: '#ff5a00',
    fontWeight: 'bold',
    marginBottom: 5, 
    fontFamily:'Oswald',
  },
  balance: {
    fontSize: 24,              // Larger font size for balance
    color: '#000',
    fontWeight: 'bold',
    fontFamily:"Oswald"
  },
  image1: {
    width: 50,
    height: 50,
  }
});
