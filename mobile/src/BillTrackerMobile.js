// /mobile/src/BillTrackerMobile.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TextInput, Button, 
  StyleSheet, Alert, ActivityIndicator, RefreshControl 
} from 'react-native';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firestore = getFirestore();
const auth = getAuth();

const BillTrackerMobile = () => {
  const [bills, setBills] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch bills from Firestore
  const fetchBills = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const billsQuery = query(
        collection(firestore, 'bills'),
        where('uid', '==', user.uid)
      );
      const querySnapshot = await getDocs(billsQuery);
      const fetchedBills = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBills(fetchedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      Alert.alert('Error', 'Failed to load bills.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Handle bill addition
  const handleAddBill = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add a bill.');
      return;
    }

    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Both description and amount are required.');
      return;
    }

    try {
      const newBill = {
        uid: user.uid,
        description: description.trim(),
        amount: parseFloat(amount),
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'bills'), newBill);
      setBills((prevBills) => [...prevBills, newBill]);
      setDescription('');
      setAmount('');
      Alert.alert('Success', 'Bill added successfully.');
    } catch (error) {
      console.error('Error adding bill:', error);
      Alert.alert('Error', 'Failed to add the bill.');
    }
  };

  // Fetch bills when the component mounts
  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBills();
  }, [fetchBills]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading Bills...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bill Tracker</Text>
      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Text style={styles.billDescription}>{item.description}</Text>
            <Text style={styles.billAmount}>${item.amount.toFixed(2)}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Bill Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Button title="Add Bill" onPress={handleAddBill} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  billItem: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  billDescription: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  billAmount: {
    fontSize: 16,
    color: '#1976d2',
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#555',
  },
});

export default BillTrackerMobile;
