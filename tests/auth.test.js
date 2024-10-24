// /tests/auth.test.js

const { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  deleteUser 
} = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('../database/firebase-config.json');

// Initialize Firebase App
initializeApp(firebaseConfig);
const auth = getAuth();

describe('Authentication Tests', () => {
  const testEmail = `testuser-${Date.now()}@example.com`; // Unique email for each test run
  const testPassword = 'Test@1234';
  let user = null; // Store user reference for cleanup

  afterAll(async () => {
    // Cleanup: Delete the test user after tests are done
    if (user) {
      await deleteUser(user).catch((error) => {
        console.error('Error deleting user:', error.message);
      });
    }
  });

  it('should create a new user successfully', async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    user = userCredential.user; // Save user reference for later cleanup
    expect(user.email).toBe(testEmail);
  });

  it('should login an existing user successfully', async () => {
    const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    expect(userCredential.user.email).toBe(testEmail);
  });

  it('should throw an error for invalid login credentials', async () => {
    const invalidPassword = 'wrongPassword';

    await expect(
      signInWithEmailAndPassword(auth, testEmail, invalidPassword)
    ).rejects.toThrow('Firebase: Error');
  });

  it('should throw an error when creating a user with an existing email', async () => {
    await expect(
      createUserWithEmailAndPassword(auth, testEmail, testPassword)
    ).rejects.toThrow('Firebase: Error (auth/email-already-in-use).');
  });
});
