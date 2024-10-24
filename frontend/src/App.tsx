/* eslint-disable @typescript-eslint/no-redeclare */
// /frontend/src/App.tsx

import React, { useEffect, useState, FC, Suspense, createContext, useContext, ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation, Trans } from 'react-i18next';
import Dashboard from './Dashboard';
import Authentication from './Authentication';
import Profile from './Profile';
import BillTracker from './BillTracker';
import './assets/styles.css';
import 'react-toastify/dist/ReactToastify.css';

// Firebase Initialization
const firebaseConfig = {
apiKey: "AIzaSyBHAFsCc4lq4BceInquAKscpNvX988i4_Q",
  authDomain: "wheresgandhi-77451.firebaseapp.com",
  projectId: "wheresgandhi-77451",
  storageBucket: "wheresgandhi-77451.appspot.com",
  messagingSenderId: "174362976106",
  appId: "1:174362976106:web:6b86a71d0b679f4ebe0f13",
  measurementId: "G-Z5QFTF0V58",
};
initializeApp(firebaseConfig);

// Firebase Auth Instance
const auth = getAuth();

// Define Authentication Context
interface AuthContextProps {
  user: User | null;
  loading: boolean;
  role?: string;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });
const useAuthContext = () => useContext(AuthContext); // Custom Hook

// Define Theme Configuration
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});


const LoadingFallback: FC = () => (
  <div className="loading-container">
    <CircularProgress size={40} />
    <p>Loading...</p>
  </div>
);

// Centralize App Routes for Clean Routing Logic
interface AppRoutesProps {
  user: User | null;
  role?: string;
  notify: (message: string, type?: 'success' | 'error') => void;
}

const AppRoutes: FC<AppRoutesProps> = ({ user, role, notify }) => (
  <Routes>
    <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    <Route path="/dashboard" element={user ? <Dashboard notify={notify} /> : <Navigate to="/login" replace />} />
    <Route path="/login" element={!user ? <Authentication notify={notify} /> : <Navigate to="/dashboard" replace />} />
    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
    <Route path="/bill-tracker" element={user ? <BillTracker /> : <Navigate to="/login" replace />} />
    <Route path="/admin" element={role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />
  </Routes>
);

const App = () => {
  return <div>Hello, WheresGandhi!</div>;
};


export default App;
