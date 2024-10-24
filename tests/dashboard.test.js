// /tests/dashboard.test.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword, deleteUser } = require('firebase/auth');
const firebaseConfig = require('../database/firebase-config.json');

// Initialize Firebase App and Services
initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

describe('Dashboard Tests', () => {
  const testEmail = `dashboarduser-${Date.now()}@example.com`;
  const testPassword = 'Test@1234';
  let user = null;
  let sampleBills = []; // Store sample bills for validation

  // Setup: Create a test user and add sample bills to Firestore
  beforeAll(async () => {
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    user = userCredential.user;

    // Add sample bills for the user
    sampleBills = [
      { description: 'Electricity Bill', amount: 120.5, status: 'paid' },
      { description: 'Internet Bill', amount: 60.0, status: 'pending' },
    ];

    const billsCollection = collection(firestore, 'bills');
    for (const bill of sampleBills) {
      await addDoc(billsCollection, { ...bill, uid: user.uid, createdAt: new Date() });
    }
  });

  // Cleanup: Delete the test user and remove all bills for the user
  afterAll(async () => {
    if (user) {
      await deleteUser(user).catch((error) => console.error('Error deleting user:', error.message));
    }

    const userBillsQuery = query(
      collection(firestore, 'bills'),
      where('uid', '==', user.uid)
    );
    const querySnapshot = await getDocs(userBillsQuery);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  });

  it('should display the total number of bills on the dashboard', async () => {
    const billsQuery = query(
      collection(firestore, 'bills'),
      where('uid', '==', user.uid)
    );

    const querySnapshot = await getDocs(billsQuery);
    expect(querySnapshot.size).toBe(sampleBills.length);
  });

  it('should calculate the total amount due for pending bills', async () => {
    const pendingBillsQuery = query(
      collection(firestore, 'bills'),
      where('uid', '==', user.uid),
      where('status', '==', 'pending')
    );

    const querySnapshot = await getDocs(pendingBillsQuery);
    const totalAmount = querySnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);

    expect(totalAmount).toBe(60.0);
  });

  it('should retrieve only paid bills', async () => {
    const paidBillsQuery = query(
      collection(firestore, 'bills'),
      where('uid', '==', user.uid),
      where('status', '==', 'paid')
    );

    const querySnapshot = await getDocs(paidBillsQuery);
    const paidBills = querySnapshot.docs.map((doc) => doc.data());

    expect(paidBills.length).toBe(1);
    expect(paidBills[0].description).toBe('Electricity Bill');
  });
});
