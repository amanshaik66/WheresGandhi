// Import Firebase modules correctly
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHAFsCc4lq4BceInquAKscpNvX988i4_Q",
  authDomain: "wheresgandhi-77451.firebaseapp.com",
  projectId: "wheresgandhi-77451",
  storageBucket: "wheresgandhi-77451.appspot.com",
  messagingSenderId: "174362976106",
  appId: "1:174362976106:web:6b86a71d0b679f4ebe0f13",
  measurementId: "G-Z5QFTF0V58"
};

// Initialize Firebase and analytics
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
getAnalytics(app);

// Handle Signup Form Submission with enhanced error handling
const form = document.getElementById('signup-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value; // Assuming you have a password input

  if (!email || !password) {
    document.getElementById('message').textContent = "Email and password are required.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data in Firestore with proper error handling
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      signupDate: new Date().toISOString()
    });

    document.getElementById('message').textContent = "Thank you for signing up!";
    console.log(`User created: ${user.email}`);
  } catch (error) {
    console.error("Error signing up:", error);
    handleSignupError(error);
  }
});

// Function to handle signup errors more gracefully
function handleSignupError(error) {
  let message = "Signup failed! Please try again.";

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = "This email is already in use.";
      break;
    case 'auth/invalid-email':
      message = "The email address is invalid.";
      break;
    case 'auth/weak-password':
      message = "Password must be at least 6 characters long.";
      break;
    default:
      message = "An unexpected error occurred. Please try again.";
  }

  document.getElementById('message').textContent = message;
}
