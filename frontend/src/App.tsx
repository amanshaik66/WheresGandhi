// /frontend/src/App.tsx

import React, { useEffect, useState, FC, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import Dashboard from './Dashboard';
import Authentication from './Authentication';
import Profile from './Profile';
import BillTracker from './BillTracker';
import './assets/styles.css';

// Firebase Configuration (Load from .env or firebase-config.json)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase App
initializeApp(firebaseConfig);

// Firebase Auth instance
const auth = getAuth();

/**
 * App Component: Main entry point for the React application.
 * Handles routing and user state management.
 */
const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Clean up the subscription
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} />
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={<div className="loading-container"><CircularProgress size={40} /></div>}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Authentication /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/bill-tracker"
            element={user ? <BillTracker /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
