// /mobile/src/App.js

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, ActivityIndicator, StyleSheet, View, Text, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Authentication from './Authentication';
import BillTrackerMobile from './BillTrackerMobile';
import ReferralProgram from './ReferralProgram';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase App
initializeApp(firebaseConfig);
const auth = getAuth();

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error('Authentication error:', error.message);
      Alert.alert('Error', 'Failed to authenticate. Please try again.');
      setLoading(false);
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Authentication" component={Authentication} />
        ) : (
          <>
            <Stack.Screen name="Bill Tracker" component={BillTrackerMobile} />
            <Stack.Screen name="Referral Program" component={ReferralProgram} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Separate LoadingScreen component for cleaner code
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#1976d2" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
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

export default App;
