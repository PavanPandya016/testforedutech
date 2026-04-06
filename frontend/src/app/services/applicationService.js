import { api } from './api/api';

export const applicationService = {
  /**
   * Submit a course application.
   * @param {Object} applicationData { courseTitle, fullName, email, phoneNumber, educationLevel, note }
   */
  submitApplication: async (applicationData) => {
    try {
      return await api.post('/auth/apply', applicationData);
    } catch (error) {
      console.error('Error in applicationService.submitApplication:', error);
      throw error;
    }
  }
};

export default applicationService;
