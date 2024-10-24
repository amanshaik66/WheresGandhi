// /analytics/dashboard-analytics.js

import { trackEvent } from './tracking';

/**
 * Log a dashboard view event.
 */
export const logDashboardView = () => {
  trackEvent('dashboard_view', { timestamp: Date.now() });
};

/**
 * Log when a user adds a new bill.
 * @param {number} amount - The amount of the bill.
 */
export const logBillAdded = (amount) => {
  trackEvent('bill_added', { amount });
};

/**
 * Log when a user completes a referral.
 */
export const logReferralCompleted = () => {
  trackEvent('referral_completed', { timestamp: Date.now() });
};
