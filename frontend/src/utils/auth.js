/**
 * Authentication Utility
 * Handles JWT token storage and management
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authUtils = {
  // Store token in localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Store user data in localStorage
  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Get user data from localStorage
  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Remove user data from localStorage
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  // Clear all auth data
  clearAuth() {
    this.removeToken();
    this.removeUser();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Get Authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

/**
 * Fetch wrapper that automatically adds Authorization header
 */
export async function authFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...authUtils.getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If token is invalid/expired, clear auth and redirect to login
  if (response.status === 401 || response.status === 403) {
    authUtils.clearAuth();
    // Trigger re-render by dispatching custom event
    window.dispatchEvent(new CustomEvent('auth-expired'));
  }

  return response;
}
