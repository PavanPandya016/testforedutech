import { api } from './api/api';

/**
 * Service for instructor related operations.
 */
export const instructorService = {
  /**
   * Fetches all instructors for public display.
   */
  getInstructors: async () => {
    try {
      const response = await api.get('/instructors');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching instructors:', error);
      throw error;
    }
  }
};

export default instructorService;
