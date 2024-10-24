// /analytics/tracking.js

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import firebaseConfig from '../database/firebase-config.json';

// Initialize Firebase App and Analytics
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/**
 * Track a custom event.
 * @param {string} eventName - The name of the event to log.
 * @param {object} [params={}] - Optional parameters to provide additional details.
 */
export const trackEvent = (eventName, params = {}) => {
  try {
    logEvent(analytics, eventName, params);
    console.log(`Event logged: ${eventName}`, params);
  } catch (error) {
    console.error('Error logging event:', error);
  }
};
