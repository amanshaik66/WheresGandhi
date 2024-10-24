// /backend/routes/authRoutes.js

const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();

/**
 * User Signup Route
 * Creates a new user in Firebase Authentication.
 */
router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: userRecord,
    });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Delete User Route
 * Deletes a user from Firebase Authentication by their UID.
 */
router.delete('/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    await admin.auth().deleteUser(uid);
    res.status(200).json({ message: `User with UID ${uid} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
