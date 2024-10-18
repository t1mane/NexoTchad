import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from './../../config/FirebaseConfig';
import { collection, doc, getDoc, query, where, or, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';

export default function RecentScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    const transactionsRef = collection(FIRESTORE_DB, 'Transactions');
    const transactionsQuery = query(
      transactionsRef,
      or(
        where('senderId', '==', currentUser.uid),
        where('receiverId', '==', currentUser.uid)
      ),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    try {
      const snapshot = await getDocs(transactionsQuery);
      const transactionsList = await Promise.all(snapshot.docs.map(async (transactionDoc) => {
        const transactionData = transactionDoc.data();
        
        let transactionType, counterpartEmail;
        if (transactionData.senderId === currentUser.uid) {
          // Sent transaction
          transactionType = 'À';
          const receiverDocRef = doc(FIRESTORE_DB, 'Users', transactionData.receiverId);
          const receiverDoc = await getDoc(receiverDocRef);
          counterpartEmail = receiverDoc.exists() ? receiverDoc.data().email : 'Email inconnu';
        } else {
          // Received transaction
          transactionType = 'De';
          const senderDocRef = doc(FIRESTORE_DB, 'Users', transactionData.senderId);
          const senderDoc = await getDoc(senderDocRef);
          counterpartEmail = senderDoc.exists() ? senderDoc.data().email : 'Email inconnu';
        }

        // Convert Firestore Timestamp to JavaScript Date
        const transactionDate = transactionData.timestamp?.toDate();

        return { 
          id: transactionDoc.id, 
          ...transactionData, 
          transactionType,
          counterpartEmail,
          transactionDate
        };
      }));
      setTransactions(transactionsList);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions : ", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setLastVisible(null);
    await fetchTransactions();
    setRefreshing(false);
  };

  const fetchMoreTransactions = async () => {
    if (!lastVisible) return;

    setIsFetchingMore(true);
    const transactionsRef = collection(FIRESTORE_DB, 'Transactions');
    const transactionsQuery = query(
      transactionsRef,
      or(
        where('senderId', '==', currentUser.uid),
        where('receiverId', '==', currentUser.uid)
      ),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(10)
    );
    try {
      const snapshot = await getDocs(transactionsQuery);
      const moreTransactions = await Promise.all(snapshot.docs.map(async (transactionDoc) => {
        const transactionData = transactionDoc.data();

        let transactionType, counterpartEmail;
        if (transactionData.senderId === currentUser.uid) {
          transactionType = 'À';
          const receiverDocRef = doc(FIRESTORE_DB, 'Users', transactionData.receiverId);
          const receiverDoc = await getDoc(receiverDocRef);
          counterpartEmail = receiverDoc.exists() ? receiverDoc.data().email : 'Email inconnu';
        } else {
          transactionType = 'De';
          const senderDocRef = doc(FIRESTORE_DB, 'Users', transactionData.senderId);
          const senderDoc = await getDoc(senderDocRef);
          counterpartEmail = senderDoc.exists() ? senderDoc.data().email : 'Email inconnu';
        }

        const transactionDate = transactionData.timestamp?.toDate();

        return { 
          id: transactionDoc.id, 
          ...transactionData, 
          transactionType,
          counterpartEmail,
          transactionDate 
        };
      }));
      setTransactions(prev => [...prev, ...moreTransactions]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions supplémentaires : ", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        <Text style={[styles.transactionLabel, styles.orangeText]}>Montant : </Text>
        {item.amount}
      </Text>

      <Text style={styles.transactionText}>
        <Text style={[styles.transactionLabel, styles.orangeText]}>{item.transactionType} : </Text>
        {item.counterpartEmail}
      </Text>

      <Text style={styles.transactionText}>
        <Text style={[styles.transactionLabel, styles.orangeText]}>Statut : </Text>
        {item.status}
      </Text>

      <Text style={styles.transactionText}>
        <Text style={[styles.transactionLabel, styles.orangeText]}>Date : </Text>
        {item.transactionDate ? item.transactionDate.toLocaleString('fr-FR') : 'Date invalide'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Activité Récente</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff5a00" />
      ) : (
        <FlatList
  data={transactions}
  renderItem={renderTransaction}
  keyExtractor={(item, index) => `${item.id}-${index}`}
  onEndReached={fetchMoreTransactions}
  onEndReachedThreshold={0.5}
  refreshing={refreshing}
  onRefresh={onRefresh}
  ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#ff5a00" /> : null}
/>

      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff5a00',
    fontFamily: 'Oswald-Bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  transactionItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLabel: {
    fontSize: 18,
    color: '#ff5a00',
    fontFamily: 'Oswald',
  },
  transactionText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Oswald',
    marginBottom: 5,
  },
  orangeText: {
    color: '#ff5a00',
  },
});
