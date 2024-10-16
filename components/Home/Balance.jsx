import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React from 'react';
import { Image } from 'react-native';

export default function Balance({ balance }) {
  const handlePress = () => {
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
          {/* Display balance or a loading indicator */}
          {balance === null ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.balance}>{balance.toFixed(2)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: 25,
    alignSelf: 'center',
    width: '100%',
  },
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 20,
  },
  title: {
    fontSize: 18,
    color: '#ff5a00',
    fontWeight: 'bold',
    marginBottom: 5, 
    fontFamily:'Oswald',
  },
  balance: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
    fontFamily:"Oswald"
  },
  image1: {
    width: 50,
    height: 50,
  }
});
