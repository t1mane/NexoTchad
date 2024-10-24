import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifiedTransactions, setNotifiedTransactions] = useState(new Set()); // Keep track of notified transaction IDs
  const [lastLoginTime, setLastLoginTime] = useState(null); // Track the last login time
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  // Get the user's last login time
  useEffect(() => {
    const fetchLastLoginTime = async () => {
      const currentTime = new Date();
      setLastLoginTime(currentTime);
    };

    fetchLastLoginTime();
  }, []);

  useEffect(() => {
    // Listen to the Transactions collection for any changes
    const transactionsRef = collection(db, 'Transactions');
    const transactionsQuery = query(transactionsRef, orderBy('timestamp', 'desc'));

    const unsubscribeTransactions = onSnapshot(transactionsQuery, async (snapshot) => {
      const newNotifications = [];
      for (const docChange of snapshot.docChanges()) {
        if (docChange.type === 'added') { // Only handle newly added transactions
          const transaction = docChange.doc.data();
          const { senderId, receiverId, amount, timestamp } = transaction;
          const transactionId = docChange.doc.id;

          // Check if the current user is either the sender or the receiver
          if ((currentUser.uid === senderId || currentUser.uid === receiverId) && !notifiedTransactions.has(transactionId)) {
            let message = '';
            
            // Check if it's a top-up (senderId === receiverId)
            if (senderId === receiverId && senderId === currentUser.uid) {
              message = `Vous avez rechargé votre compte de ${amount} crédits.`;
            } else if (currentUser.uid === senderId) {
              const receiverEmail = await getUserEmail(receiverId);
              message = `Vous avez envoyé ${amount} crédits à ${receiverEmail}.`;
            } else if (currentUser.uid === receiverId) {
              const senderEmail = await getUserEmail(senderId);
              message = `Vous avez reçu ${amount} crédits de ${senderEmail}.`;
            }

            // Trigger alert only if the new notification is created after the last login time
            if (lastLoginTime && timestamp.toDate() > lastLoginTime) {
              Alert.alert('Nouvelle Notification', message);
            }

            // Add the notification to the local state
            newNotifications.push({
              id: transactionId,
              message,
              timestamp
            });

            // Add the transactionId to the notified set to prevent duplicate notifications
            setNotifiedTransactions((prevNotified) => new Set(prevNotified).add(transactionId));
          }
        }
      }

      // Update the state with new notifications
      setNotifications((prevNotifications) => [...prevNotifications, ...newNotifications]);

      // Stop the loading spinner
      setLoading(false);
    });

    return () => unsubscribeTransactions(); // Clean up listener on unmount
  }, [db, currentUser.uid, lastLoginTime, notifiedTransactions]);

  // Fetch user email by userId from 'Users' collection
  const getUserEmail = async (userId) => {
    const userDoc = await getDoc(doc(db, 'Users', userId));
    return userDoc.exists() ? userDoc.data().email : 'Email Inconnu';
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulate refresh delay
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.dateText}>
        {new Date(item.timestamp?.seconds * 1000).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ff5a00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune Notification</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: '#ff5a00',
    fontFamily:'oswald'
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#ff5a00',
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    fontFamily:'oswald'
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    fontFamily:'oswald'
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});
