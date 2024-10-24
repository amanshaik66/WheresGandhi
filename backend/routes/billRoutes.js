// /backend/routes/billRoutes.js

const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const firestore = admin.firestore();

/**
 * Add a New Bill
 * Creates a new bill entry in Firestore for the user.
 */
router.post('/add', async (req, res) => {
  const { uid, description, amount, dueDate, status } = req.body;

  try {
    const newBill = {
      uid,
      description,
      amount,
      dueDate,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection('bills').add(newBill);
    res.status(201).json({
      message: 'Bill added successfully',
      billId: docRef.id,
    });
  } catch (error) {
    console.error('Error adding bill:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get Bills by User
 * Retrieves all bills for a specific user from Firestore.
 */
router.get('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const billsSnapshot = await firestore
      .collection('bills')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get();

    if (billsSnapshot.empty) {
      return res.status(404).json({ message: 'No bills found for this user.' });
    }

    const bills = billsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ bills });
  } catch (error) {
    console.error('Error fetching bills:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Delete a Bill
 * Deletes a bill by its ID.
 */
router.delete('/:billId', async (req, res) => {
  const { billId } = req.params;

  try {
    await firestore.collection('bills').doc(billId).delete();
    res.status(200).json({ message: `Bill ${billId} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting bill:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
