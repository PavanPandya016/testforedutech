/**
 * Centralized API utility for handling HTTP requests.
 * Uses the fetch API with standardized error handling and base URL configuration.
 * All requests return a Promise that resolves to the JSON response data.
 * Throws an Error with status and data properties if the request fails.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json();
};

const getHeaders = (headers = {}) => {
  const token = localStorage.getItem('edutech_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers,
  };
};

export const api = {
  get: async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(options.headers),
      credentials: 'include',
      ...options,
    });
    return handleResponse(response);
  },

  post: async (endpoint, data, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(options.headers),
      credentials: 'include',
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  put: async (endpoint, data, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(options.headers),
      credentials: 'include',
      body: JSON.stringify(data),
      ...options,
    });
    return handleResponse(response);
  },

  delete: async (endpoint, options = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(options.headers),
      credentials: 'include',
      ...options,
    });
    return handleResponse(response);
  },
};
