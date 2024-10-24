// /mobile/src/ReferralProgram.js

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, FlatList, TextInput, Button, StyleSheet, 
  Alert, ActivityIndicator, Pressable 
} from 'react-native';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Clipboard from 'expo-clipboard'; // Expo clipboard module for better compatibility

const firestore = getFirestore();
const auth = getAuth();

const ReferralProgram = () => {
  const [referrals, setReferrals] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);

  const generateReferralCode = useCallback(() => {
    const user = auth.currentUser;
    if (!user) return;
    const code = `${user.uid.slice(0, 6)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setReferralCode(code);
  }, []);

  useEffect(() => {
    generateReferralCode();
    fetchReferrals();
  }, [generateReferralCode]);

  const fetchReferrals = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const referralsQuery = query(
        collection(firestore, 'referrals'),
        where('referrerUid', '==', user.uid)
      );

      const querySnapshot = await getDocs(referralsQuery);
      const fetchedReferrals = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReferrals(fetchedReferrals);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      Alert.alert('Error', 'Failed to load referrals.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(referralCode);
      Alert.alert('Copied', 'Referral code copied to clipboard!');
    } catch (error) {
      console.error('Clipboard error:', error);
      Alert.alert('Error', 'Failed to copy referral code.');
    }
  };

  const handleAddReferral = async (referredEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const newReferral = {
        referrerUid: user.uid,
        referredEmail,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'referrals'), newReferral);
      setReferrals((prev) => [...prev, newReferral]);
      Alert.alert('Success', 'Referral added successfully!');
    } catch (error) {
      console.error('Error adding referral:', error);
      Alert.alert('Error', 'Failed to add referral.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Loading Referrals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Referral Program</Text>
      <Text style={styles.subHeader}>Share this code to earn rewards:</Text>
      <View style={styles.codeContainer}>
        <Text style={styles.referralCode}>{referralCode}</Text>
        <Pressable onPress={handleCopyCode} style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Copy Code</Text>
        </Pressable>
      </View>

      <Text style={styles.referralsHeader}>Your Referrals</Text>
      <FlatList
        data={referrals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.referralItem}>
            <Text style={styles.referralEmail}>{item.referredEmail}</Text>
            <Text style={styles.referralDate}>
              Joined: {new Date(item.createdAt.seconds * 1000).toLocaleDateString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>No referrals yet. Share your code!</Text>}
      />
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  copyButton: {
    padding: 8,
    backgroundColor: '#1976d2',
    borderRadius: 4,
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  referralsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  referralItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  referralEmail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  referralDate: {
    fontSize: 14,
    color: '#555',
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

export default ReferralProgram;
