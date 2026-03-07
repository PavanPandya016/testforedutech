import { api } from './api/api';

/**
 * Service for course-related operations.
 */
export const courseService = {
  /**
   * Fetches course categories from the API.
   * @async
   * @returns {Promise<Array>} A promise that resolves to an array of category objects or strings.
   * @throws {Error} If the API request fails.
   */
  getCategories: async () => {
    try {
      return await api.get('/products/categories');
    } catch (error) {
      console.error('Error in courseService.getCategories:', error);
      throw error;
    }
  },
};

export default courseService;
