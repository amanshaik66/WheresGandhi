// Import Firebase modules correctly
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
getAnalytics(app);

// Signup Form Submission
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            signupDate: new Date().toISOString()
        });

        document.getElementById('message').textContent = "Thank you for signing up!";
    } catch (error) {
        console.error("Error signing up:", error);
        document.getElementById('message').textContent = "Signup failed! This email may already be in use.";
    }
});

// Sign-In Form Submission
const signinForm = document.getElementById('signin-form');
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        document.getElementById('message').textContent = `Welcome back, ${user.email}!`;
    } catch (error) {
        console.error("Error signing in:", error);
        document.getElementById('message').textContent = "Login failed. Please check your credentials.";
    }
});

// Fetch and display all users from Firestore (optional feature)
async function fetchUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}
