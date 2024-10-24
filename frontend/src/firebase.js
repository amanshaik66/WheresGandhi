// /frontend/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBHAFsCc4lq4BceInquAKscpNvX988i4_Q",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "wheresgandhi-77451.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "wheresgandhi-77451",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "wheresgandhi-77451.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "174362976106",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:174362976106:web:6b86a71d0b679f4ebe0f13",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-Z5QFTF0V58",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, firestore, analytics };
