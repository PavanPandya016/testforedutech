/**
 * Structured storage service for managing localStorage interactions.
 */

export const storageService = {
  /**
   * Get data from localStorage.
   * @param {string} key
   * @param {any} defaultValue
   * @returns {any}
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting from storage [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * Set data in localStorage.
   * @param {string} key
   * @param {any} value
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting in storage [${key}]:`, error);
    }
  },

  /**
   * Remove data from localStorage.
   * @param {string} key
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage [${key}]:`, error);
    }
  },

  /**
   * Clear all matching keys from localStorage that start with a specific prefix.
   * @param {string} prefix - The prefix to match keys against.
   */
  clearWithPrefix: (prefix) => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error(`Error clearing storage with prefix [${prefix}]:`, error);
    }
  }
};

export default storageService;
