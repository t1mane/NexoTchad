import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Balance() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Balance</Text>
        {/* Placeholder for balance amount - replace with actual balance value */}
        <Text style={styles.balance}>$0.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: '90%', // Adjust width as needed
  },
  container: {
    padding: 20,               // Add padding inside the box
    backgroundColor: '#f9f9f9', // Light gray background color
    borderRadius: 10,          // Rounded corners
    borderWidth: 1,            // Border width
    borderColor: '#ddd',       // Border color
    alignItems: 'center',      // Center items horizontally
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2,        // Shadow opacity
    shadowRadius: 4,           // Shadow radius
    elevation: 3,              // Elevation for Android shadow
  },
  title: {
    fontSize: 18,
    color: '#333',
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
});
