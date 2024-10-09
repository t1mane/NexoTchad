import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

export default function ContactsNexo() {
  const handleAddContact = () => {
    console.log('Add Contact Pressed');
  };

  const handleMoreOptions = () => {
    console.log('More Options Pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      
      <View style={styles.contactsBox}>
        {/* First Row of Contacts */}
        <View style={styles.contactRow}>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>om</Text>
          </View>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>PM</Text>
          </View>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>PM</Text>
          </View>
          <TouchableOpacity style={styles.addContactCircle} onPress={handleAddContact}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Second Row of Contacts */}
        <View style={styles.contactRow}>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>om</Text>
          </View>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>PM</Text>
          </View>
          <View style={styles.contactCircle}>
            <Text style={styles.contactText}>PM</Text>
          </View>
          <TouchableOpacity style={styles.moreOptionsCircle} onPress={handleMoreOptions}>
            <Text style={styles.moreOptionsText}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'flex-start', // Align content to the left
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    fontFamily: 'Oswald-Bold'
  },
  contactsBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactCircle: {
    flex: 1,                // Make circles take up equal space
    height: 60,             // Increase the height of the circle
    aspectRatio: 1,         // Ensure the width and height are equal
    borderRadius: 30,       // Set the radius to half of the height to maintain a perfect circle
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,   // Spacing between circles
  },
  addContactCircle: {
    flex: 1,                // Make circles take up equal space
    height: 60,
    aspectRatio: 1,
    borderRadius: 30,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  moreOptionsCircle: {
    flex: 1,                // Make circles take up equal space
    height: 60,
    aspectRatio: 1,
    borderRadius: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  contactText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Oswald-Bold',
    color: '#000',
  },
  addText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  moreOptionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
});
