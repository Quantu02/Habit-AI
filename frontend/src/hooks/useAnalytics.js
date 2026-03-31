import { useState, useEffect } from 'react';
import api from '../services/api';

function useAnalytics(habits) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.post('/analytics/', { habits });
        setAnalytics(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (habits && habits.length > 0) {
      fetchAnalytics();
    }
  }, [habits]);

  return { analytics, loading, error };
}

export default useAnalytics;
