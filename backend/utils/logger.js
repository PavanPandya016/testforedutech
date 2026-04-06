const { ActivityLog } = require('../models');

/**
 * Utility function to log platform activities.
 * @param {string} userId - ID of the user performing the action or related to the action.
 * @param {string} action - Type of action (user_joined, course_added, etc.).
 * @param {string} details - Human-readable details (e.g. "Course: Web Development").
 */
const logActivity = async (userId, action, details) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      details
    });
    console.log(`[Activity Log] ${action}: ${details}`);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

module.exports = { logActivity };
