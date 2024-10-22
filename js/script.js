// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Toggle between Sign Up and Sign In
let isSignUp = true;

document.getElementById('toggle-auth').addEventListener('click', () => {
    isSignUp = !isSignUp;
    document.getElementById('auth-button').textContent = isSignUp ? 'Sign Up' : 'Sign In';
    document.getElementById('toggle-text').innerHTML = isSignUp
        ? 'Already have an account? <span id="toggle-auth">Sign In</span>'
        : 'New user? <span id="toggle-auth">Sign Up</span>';
});

// Handle Form Submission
const form = document.getElementById('auth-form');
const loader = document.getElementById('loader');
const messageElement = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loader.classList.remove('hidden');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        let user;
        if (isSignUp) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            await sendEmailVerification(user);

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                signupDate: new Date().toISOString()
            });

            messageElement.textContent = "Sign-up successful! Please verify your email.";
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
        }

        window.location.href = 'currency-tracker.html';
    } catch (error) {
        console.error("Authentication error:", error);
        messageElement.textContent = error.message;
    } finally {
        loader.classList.add('hidden');
    }
});

// Google Sign-In
document.getElementById('google-signin').addEventListener('click', async () => {
    loader.classList.remove('hidden');
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        messageElement.textContent = `Welcome, ${user.email}!`;
        window.location.href = 'currency-tracker.html';
    } catch (error) {
        console.error("Google Sign-In error:", error);
        messageElement.textContent = error.message;
    } finally {
        loader.classList.add('hidden');
    }
});
