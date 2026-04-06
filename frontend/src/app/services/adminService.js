import { api } from './api/api';

/**
 * Service for administrative operations.
 */
export const adminService = {
  /**
   * Fetches overall platform statistics.
   */
  getStats: async () => {
    try {
      return await api.get('/admin/stats');
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  },

  /**
   * Fetches public platform statistics (counts only).
   */
  getPublicStats: async () => {
    try {
      return await api.get('/admin/public-stats');
    } catch (error) {
      console.error('Error fetching public stats:', error);
      throw error;
    }
  },

  /**
   * Fetches all registered users.
   */
  getUsers: async () => {
    try {
      const data = await api.get('/admin/users');
      return data.users || [];
    } catch (error) {
      console.error('Error fetching admin users:', error);
      throw error;
    }
  },

  /**
   * Updates a user's role or status.
   */
  updateUser: async (id, userData) => {
    try {
      return await api.put(`/admin/users/${id}`, userData);
    } catch (error) {
      console.error('Error updating admin user:', error);
      throw error;
    }
  },

  /**
   * Deletes a user from the platform.
   */
  deleteUser: async (id) => {
    try {
      return await api.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error('Error deleting admin user:', error);
      throw error;
    }
  },

  /**
   * Fetches all entities of a specific type (blogs, courses, events).
   */
  getEntities: async (type, fullResponse = false) => {
    try {
      const data = await api.get(`/admin/entities/list/${type}`);
      return fullResponse ? data : (data.data || []);
    } catch (error) {
      console.error(`Error fetching admin entities (${type}):`, error);
      throw error;
    }
  },

  /**
   * Fetches a single entity of a specific type (blogs, courses, events) by id.
   */
  getEntity: async (type, id) => {
    try {
      const data = await api.get(`/admin/entities/get/${type}/${id}`);
      return data.data;
    } catch (error) {
      console.error(`Error fetching admin entity (${type}/${id}):`, error);
      throw error;
    }
  },

  /**
   * Deletes an entity of a specific type.
   */
  deleteEntity: async (type, id) => {
    try {
      return await api.delete(`/admin/entities/delete/${type}/${id}`);
    } catch (error) {
      console.error(`Error deleting admin entity (${type}):`, error);
      throw error;
    }
  },

  /**
   * Creates an entity of a specific type.
   */
  createEntity: async (type, data) => {
    try {
      return await api.post(`/admin/entities/create/${type}`, data);
    } catch (error) {
      console.error(`Error creating admin entity (${type}):`, error);
      throw error;
    }
  },

  /**
   * Updates an entity of a specific type.
   */
  updateEntity: async (type, id, data) => {
    try {
      return await api.put(`/admin/entities/update/${type}/${id}`, data);
    } catch (error) {
      console.error(`Error updating admin entity (${type}):`, error);
      throw error;
    }
  },

  /**
   * Fetches the landing page settings.
   */
  getSiteSettings: async () => {
    try {
      return await api.get('/settings');
    } catch (error) {
      console.error('Error fetching site settings:', error);
      throw error;
    }
  },

  /**
   * Updates the landing page settings.
   */
  updateSiteSettings: async (settingsData) => {
    try {
      return await api.put('/settings', settingsData);
    } catch (error) {
      console.error('Error updating site settings:', error);
      throw error;
    }
  },

  /**
   * Uploads an image to Cloudinary.
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // The backend defines /api/upload, and our base URL is /api
      return await api.post('/upload', formData);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Fetches participants for a specific event.
   */
  getEventParticipants: async (eventId) => {
    try {
      const data = await api.get(`/admin/participants/event/${eventId}`);
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching participants for event ${eventId}:`, error);
      throw error;
    }
  },

  /**
   * Fetches all course applications.
   */
  getApplications: async () => {
    try {
      const data = await api.get('/admin/applications');
      return data.data || [];
    } catch (error) {
      console.error('Error fetching course applications:', error);
      throw error;
    }
  },

  /**
   * Updates the status of a course application.
   */
  updateApplicationStatus: async (id, status) => {
    try {
      return await api.put(`/admin/applications/${id}`, { status });
    } catch (error) {
      console.error(`Error updating application ${id} status:`, error);
      throw error;
    }
  }
};

export default adminService;
