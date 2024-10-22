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

// Form submission handling
//document.getElementById('signup-form').addEventListener('submit', (e) => {
  //e.preventDefault();
  //const email = document.getElementById('email').value;
  //console.log(`Email submitted: ${email}`);
  //document.getElementById('message').textContent = "Thank you for signing up!";
//});
// Handle Signup Form Submission
const form = document.getElementById('signup-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, 'defaultPassword');
    const user = userCredential.user;

    // Save user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      signupDate: new Date().toISOString()
    });

    document.getElementById('message').textContent = "Thank you for signing up!";
    console.log(`User created: ${user.email}`);
  } catch (error) {
    console.error("Error signing up:", error);
    document.getElementById('message').textContent = "Signup failed! Please try again.";
  }
});
