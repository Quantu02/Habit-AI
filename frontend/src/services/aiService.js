import api from './api';

const AI_SERVICE = {
  /**
   * Get AI brain analysis for habits
   */
  analyzeHabits: async (habits) => {
    try {
      const response = await api.post('/ai/brain', { habits });
      return response.data;
    } catch (error) {
      console.error('Error analyzing habits:', error);
      throw error;
    }
  },

  /**
   * Get personalized recommendations
   */
  getRecommendations: async (habits) => {
    try {
      const response = await api.post('/ai/recommendations', { habits });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },

  /**
   * Get analytics for habits
   */
  getAnalytics: async (habits) => {
    try {
      const response = await api.post('/analytics/', { habits });
      return response.data;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },

  /**
   * Get AI insights
   */
  getInsights: async (habits, results, analytics) => {
    try {
      const response = await api.post('/ai/insights', {
        habits,
        results,
        analytics,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting insights:', error);
      throw error;
    }
  },
};

export default AI_SERVICE;
