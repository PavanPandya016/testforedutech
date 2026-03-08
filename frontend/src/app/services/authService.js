import { api } from './api/api';

/**
 * Service for authentication-related operations.
 */
export const authService = {
  /**
   * Registers a new user.
   * @param {Object} userData { username, name, email, password, mobile }
   */
  register: async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      if (data.token) {
        localStorage.setItem('edutech_token', data.token);
        localStorage.setItem('edutech_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error in authService.register:', error);
      throw error;
    }
  },

  /**
   * Logs in a user.
   * @param {Object} credentials { email, password }
   */
  login: async (credentials) => {
    try {
      const data = await api.post('/auth/login', credentials);
      if (data.token) {
        localStorage.setItem('edutech_token', data.token);
        localStorage.setItem('edutech_user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error in authService.login:', error);
      throw error;
    }
  },

  /**
   * Logs out the user.
   */
  logout: async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Error in authService.logout:', error);
    } finally {
      localStorage.removeItem('edutech_token');
      localStorage.removeItem('edutech_user');
    }
  },

  /**
   * Fetches the current user's profile.
   */
  getProfile: async () => {
    try {
      return await api.get('/auth/profile');
    } catch (error) {
      console.error('Error in authService.getProfile:', error);
      throw error;
    }
  },

  /**
   * Gets the currently logged-in user from localStorage.
   * @returns {Object|null} user object or null if not logged in
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('edutech_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Updates the current user's profile.
   * @param {Object} profileData
   */
  updateProfile: async (profileData) => {
    try {
      const data = await api.put('/auth/profile', profileData);
      localStorage.setItem('edutech_user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Error in authService.updateProfile:', error);
      throw error;
    }
  }
};

export default authService;
