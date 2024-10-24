// /frontend/src/utils/apiHelper.js

/**
 * A helper function to make API calls with customizable options.
 * @param {string} url - The endpoint URL.
 * @param {string} [method='GET'] - The HTTP method (e.g., 'POST', 'PUT').
 * @param {Object} [body=null] - The request payload, if needed.
 * @param {Object} [headers={}] - Additional headers to include in the request.
 * @returns {Promise<any>} - The JSON-parsed response or throws an error.
 */
export async function apiCall(url, method = 'GET', body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    console.info(`API Request: ${method} ${url}`, body || 'No body');
    
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorMessage = `API call failed with status: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.info(`API Response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error('API call error:', error.message);
    throw error;
  }
}
