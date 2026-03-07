import storageService from './storageService';

/**
 * Service to handle course and blog suggestions.
 * Manages storage and retrieval of user-submitted suggestions.
 */
const SUGGESTIONS_KEY = 'edutech_suggestions';

const suggestionService = {
  /**
   * Add a new suggestion
   * @param {Object} suggestion { type: 'course' | 'blog', title: string, description: string, email?: string }
   */
  addSuggestion(suggestion) {
    const suggestions = this.getAllSuggestions();
    const newSuggestion = {
      ...suggestion,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    suggestions.push(newSuggestion);
    storageService.set(SUGGESTIONS_KEY, suggestions);
    return newSuggestion;
  },

  /**
   * Get all suggestions
   * @returns {Array}
   */
  getAllSuggestions() {
    return storageService.get(SUGGESTIONS_KEY, []);
  },

  /**
   * Get suggestions by type
   * @param {string} type 'course' | 'blog'
   * @returns {Array}
   */
  getSuggestionsByType(type) {
    return this.getAllSuggestions().filter(s => s.type === type);
  }
};

export default suggestionService;
