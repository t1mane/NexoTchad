import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useIsFocused } from '@react-navigation/native';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertedNotifications, setAlertedNotifications] = useState(new Set()); // Track which notifications have been alerted
  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;
  const isFocused = useIsFocused(); // Check if the user is on the Notifications tab

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'Notifications');
    const notificationsQuery = query(
      notificationsRef,
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc') // Newest notifications first
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(newNotifications);

      // Check for new notifications and show alerts only for unalerted ones
      newNotifications.forEach((notification) => {
        if (!alertedNotifications.has(notification.id)) {
          if (!isFocused) {
            Alert.alert('Nouvelle Notification', notification.message);
          }
          setAlertedNotifications((prev) => new Set(prev).add(notification.id)); // Mark this notification as alerted
        }
      });

      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [currentUser, isFocused, alertedNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    setNotifications([]); // Clear current notifications
    setAlertedNotifications(new Set()); // Reset alerted notifications
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.dateText}>
        {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
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
      {notifications.length > 0 ? (
        <>
          <Text style={styles.title}>Notifications</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          />
        </>
      ) : (
        <Text style={styles.emptyText}>Vous êtes à jour!</Text>
      )}
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
    fontFamily: 'oswald',
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
    fontFamily: 'oswald',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'oswald',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#aaa',
    marginTop: 20,
  },
});
