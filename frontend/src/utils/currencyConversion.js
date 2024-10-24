// /frontend/src/utils/currencyConversion.js

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

/**
 * Converts a given amount from one currency to another.
 * @param {string} from - The currency code to convert from (e.g., 'USD').
 * @param {string} to - The currency code to convert to (e.g., 'EUR').
 * @param {number} amount - The amount to convert.
 * @returns {Promise<string | null>} - The converted amount formatted to 2 decimal places, or null if the conversion fails.
 */
export async function convertCurrency(from, to, amount) {
  try {
    const response = await fetch(`${API_URL}${from}`);

    if (!response.ok) {
      console.error(`Failed to fetch exchange rates: ${response.status}`);
      throw new Error('Failed to fetch exchange rates.');
    }

    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      console.error(`Exchange rate not available for currency: ${to}`);
      throw new Error(`Currency "${to}" not found in exchange rates.`);
    }

    const convertedAmount = (amount * rate).toFixed(2);
    console.log(`Converted ${amount} ${from} to ${convertedAmount} ${to}`);
    return convertedAmount;
  } catch (error) {
    console.error('Currency conversion error:', error.message);
    return null;
  }
}
