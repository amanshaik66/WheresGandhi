// /frontend/src/App.tsx

import React, { useEffect, useState, FC, Suspense, createContext, useContext } from 'react';
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
import AdminPanel from './AdminPanel';
import ErrorBoundary from './ErrorBoundary';
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
  role?: string;
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

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // i18n for localization

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Simulate a role fetch from Firestore or user claims
        const fetchedRole = await fetchUserRole(currentUser.uid);
        setRole(fetchedRole);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (uid: string): Promise<string> => {
    // Simulated role fetch: In real projects, fetch from Firestore or Firebase claims.
    if (uid === 'admin-user-id') return 'admin';
    return 'user';
  };

  const notify = (message: string, type: 'success' | 'error' = 'success') =>
    type === 'success' ? toast.success(message) : toast.error(message);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={70} />
        <p>{t('loading')}</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, role }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ErrorBoundary>
            <ToastContainer position="top-right" autoClose={5000} />
            <Snackbar open={loading}>
              <Alert severity="info">
                <Trans>Fetching user data...</Trans>
              </Alert>
            </Snackbar>
            <Suspense fallback={<div className="loading-container"><CircularProgress size={40} /></div>}>
              <Routes>
                <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
                <Route path="/dashboard" element={user ? <Dashboard notify={notify} /> : <Navigate to="/login" replace />} />
                <Route path="/login" element={!user ? <Authentication notify={notify} /> : <Navigate to="/dashboard" replace />} />
                <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
                <Route path="/bill-tracker" element={user ? <BillTracker /> : <Navigate to="/login" replace />} />
                <Route path="/admin" element={role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;