// /backend/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const billRoutes = require('./routes/billRoutes');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Express App
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// API Routes
app.use('/auth', authRoutes);
app.use('/bills', billRoutes);

// Export Firebase HTTPS Function
exports.api = functions.https.onRequest(app);
