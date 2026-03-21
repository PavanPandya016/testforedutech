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
  getEntities: async (type) => {
    try {
      const data = await api.get(`/admin/entities/${type}`);
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching admin entities (${type}):`, error);
      throw error;
    }
  },
  /**
   * Deletes an entity of a specific type.
   */
  deleteEntity: async (type, id) => {
    try {
      return await api.delete(`/admin/entities/${type}/${id}`);
    } catch (error) {
      console.error(`Error deleting admin entity (${type}):`, error);
      throw error;
    }
  }
};

export default adminService;
