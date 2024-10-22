// Firebase Configuration
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
firebase.initializeApp(firebaseConfig);

const form = document.getElementById('signup-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(`Email submitted: ${email}`);
});

// Initialize OpenStreetMap
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
