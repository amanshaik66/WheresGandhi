// /tests/billTracker.test.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, deleteDoc, getDocs, query, where, doc } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');
const firebaseConfig = require('../database/firebase-config.json');

// Initialize Firebase App and Services
initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

describe('Bill Tracker Tests', () => {
  const testEmail = `testuser-${Date.now()}@example.com`; // Unique email for each test run
  const testPassword = 'Test@1234';
  let user = null;
  let addedBillId = null; // Store the created bill's ID for cleanup

  // Setup: Create and log in a test user
  beforeAll(async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    user = userCredential.user;
  });

  // Cleanup: Delete the test user and any created bills
  afterAll(async () => {
    if (user) {
      await deleteUser(user).catch((error) => console.error('Error deleting user:', error.message));
    }
    if (addedBillId) {
      await deleteDoc(doc(firestore, 'bills', addedBillId)).catch((error) =>
        console.error('Error deleting bill:', error.message)
      );
    }
  });

  it('should add a new bill successfully', async () => {
    const newBill = {
      uid: user.uid,
      description: 'Test Bill',
      amount: 100.0,
      status: 'pending',
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(firestore, 'bills'), newBill);
    addedBillId = docRef.id; // Store the bill ID for cleanup

    expect(docRef.id).toBeDefined();
  });

  it('should retrieve the bills for the logged-in user', async () => {
    const billsQuery = query(
      collection(firestore, 'bills'),
      where('uid', '==', user.uid)
    );

    const querySnapshot = await getDocs(billsQuery);
    const bills = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    expect(bills.length).toBeGreaterThan(0);
    expect(bills[0].uid).toBe(user.uid);
  });

  it('should delete the bill successfully', async () => {
    const billDocRef = doc(firestore, 'bills', addedBillId);

    await deleteDoc(billDocRef);

    const querySnapshot = await getDocs(query(collection(firestore, 'bills'), where('uid', '==', user.uid)));
    const bills = querySnapshot.docs.map((doc) => doc.id);

    expect(bills).not.toContain(addedBillId);
  });
});
