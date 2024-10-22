<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBHAFsCc4lq4BceInquAKscpNvX988i4_Q",
    authDomain: "wheresgandhi-77451.firebaseapp.com",
    databaseURL: "https://wheresgandhi-77451-default-rtdb.firebaseio.com",
    projectId: "wheresgandhi-77451",
    storageBucket: "wheresgandhi-77451.appspot.com",
    messagingSenderId: "174362976106",
    appId: "1:174362976106:web:6b86a71d0b679f4ebe0f13",
    measurementId: "G-Z5QFTF0V58"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

</script>

// Form submission handling
const form = document.getElementById('signup-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(`Email submitted: ${email}`);
    document.getElementById('message').textContent = "Thank you for signing up!";
});
