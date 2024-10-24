// /frontend/src/App.tsx

import React, { useEffect, useState, FC, Suspense, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './Dashboard';
import Authentication from './Authentication';
import Profile from './Profile';
import BillTracker from './BillTracker';
import ErrorBoundary from './ErrorBoundary';
import useAuth from './hooks/useAuth';
import './assets/styles.css';
import 'react-toastify/dist/ReactToastify.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
initializeApp(firebaseConfig);

// Firebase Auth Instance
const auth = getAuth();

// Authentication Context
interface AuthContextProps {
  user: User | null;
  loading: boolean;
}
const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

// Custom Hook for Using AuthContext
const useAuthContext = () => useContext(AuthContext);

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

/**
 * App Component - Main entry point with router, authentication, and theming.
 */
const App: FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={70} />
        <p>Loading application...</p>
      </div>
    );
  }

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (message: string) => toast.error(message);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ErrorBoundary>
            <ToastContainer position="top-right" autoClose={5000} />
            <Suspense fallback={<div className="loading-container"><CircularProgress size={40} /></div>}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
                />
                <Route
                  path="/dashboard"
                  element={user ? <Dashboard notify={notifySuccess} /> : <Navigate to="/login" replace />}
                />
                <Route
                  path="/login"
                  element={!user ? <Authentication notify={notifyError} /> : <Navigate to="/dashboard" replace />}
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
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
