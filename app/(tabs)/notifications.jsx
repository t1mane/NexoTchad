import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, orderBy, limit, onSnapshot, startAfter, doc, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [lastVisible, setLastVisible] = useState(null); // To track the last notification fetched for pagination
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false); // To manage loading more data
  const [lastLoginTime, setLastLoginTime] = useState(null); // Track the last login time
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  const NOTIFICATIONS_LIMIT = 10; // Number of notifications to fetch per page

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
      for (const docChange of snapshot.docChanges()) {
        if (docChange.type === 'added') { // Only handle newly added transactions
          const transaction = docChange.doc.data();
          const { senderId, receiverId, amount, timestamp, status } = transaction;

          // Check if the current user is either the sender or the receiver
          if (currentUser.uid === senderId || currentUser.uid === receiverId) {
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

            // Store the notification in the 'Notifications' collection
            await addDoc(collection(db, 'Notifications'), {
              userId: currentUser.uid,
              senderId: senderId,
              receiverId: receiverId,
              amount: amount,
              timestamp: timestamp,
              message: message,
              status: status, // Add transaction status if needed
              type: senderId === receiverId ? 'top_up' : (currentUser.uid === senderId ? 'funds_sent' : 'funds_received'),
            });

            // Trigger alert only if the new notification is created after the last login time
            if (lastLoginTime && timestamp.toDate() > lastLoginTime) {
              Alert.alert('Nouvelle Notification', 'Une nouvelle transaction a été traitée.');
            }
          }
        }
      }
    });

    return () => unsubscribeTransactions(); // Clean up listener on unmount
  }, [db, currentUser.uid, lastLoginTime]);

  // Fetch user email by userId from 'Users' collection
  const getUserEmail = async (userId) => {
    const userDoc = await getDoc(doc(db, 'Users', userId));
    return userDoc.exists() ? userDoc.data().email : 'Email Inconnu';
  };

  // Fetch the initial batch of notifications for the logged-in user
  useEffect(() => {
    const fetchInitialNotifications = async () => {
      setLoading(true);
      const notificationsRef = collection(db, 'Notifications');
      const notificationsQuery = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(NOTIFICATIONS_LIMIT) // Fetch the first batch of notifications
      );

      const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
        if (!snapshot.empty) {
          const newNotifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Set last visible notification for pagination
          const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
          setLastVisible(lastVisibleDoc);

          setNotifications(newNotifications);
          setLoading(false);
        }
      });

      return unsubscribeNotifications; // Cleanup listener on unmount
    };

    fetchInitialNotifications();
  }, [db, currentUser.uid]);

  // Fetch more notifications when the user scrolls to the bottom
  const fetchMoreNotifications = async () => {
    if (lastVisible && !isFetchingMore) {
      setIsFetchingMore(true);
      const notificationsRef = collection(db, 'Notifications');
      const notificationsQuery = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        startAfter(lastVisible), // Fetch starting after the last fetched notification
        limit(NOTIFICATIONS_LIMIT) // Fetch the next batch of notifications
      );

      const snapshot = await getDocs(notificationsQuery);
      if (!snapshot.empty) {
        const moreNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Append new notifications to the existing ones
        setNotifications((prevNotifications) => [...prevNotifications, ...moreNotifications]);

        // Update last visible document
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      }
      setIsFetchingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setLastVisible(null); // Reset pagination
    setNotifications([]); // Clear current notifications
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
        onEndReached={fetchMoreNotifications} // Load more when the user scrolls to the bottom
        onEndReachedThreshold={0.5} // Trigger fetchMore when 50% from the bottom
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#ff5a00" /> : null}
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
