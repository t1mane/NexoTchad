import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Correcting the collection name to 'Notifications' with capital 'N'
    const q = query(
      collection(db, 'Notifications'),  // Capital 'N'
      where('userId', '==', auth.currentUser.uid) // Fetch notifications for the logged-in user
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(newNotifications); // Update state with new notifications
    });

    return unsubscribe; // Cleanup on unmount
  }, [db, auth.currentUser.uid]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderItem = ({ item }) => {
    let notificationMessage = '';
    if (item.type === 'funds_sent') {
      notificationMessage = `You have sent $${item.amount} to ${item.receiverEmail}.`;
    } else if (item.type === 'funds_received') {
      notificationMessage = `You have received $${item.amount} from ${item.senderEmail}.`;
    } else {
      notificationMessage = item.message;
    }

    return (
      <View style={styles.notificationCard}>
        <Text style={styles.notificationText}>{notificationMessage}</Text>
        <Text style={styles.dateText}>{new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vos Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Pas de Notifications!</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'oswald-bold',
    color: '#ff5a00',
  },
  notificationCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});
