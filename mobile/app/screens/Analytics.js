import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Card from '../components/Card';
import api from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // In real app, fetch from backend
      // const response = await api.post('/analytics/', { habits: [] });
      // setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      <Card title="📊 Overview">
        <Text style={styles.placeholder}>Analytics data will appear here</Text>
      </Card>

      <Card title="🏆 Top Performers">
        <Text style={styles.placeholder}>Your best habits</Text>
      </Card>

      <Card title="💡 Insights">
        <Text style={styles.placeholder}>AI-powered insights and recommendations</Text>
      </Card>

      <Card title="⚠️ Alerts">
        <Text style={styles.placeholder}>Important notifications and warnings</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    padding: 16,
  },
  error: {
    backgroundColor: '#fed7d7',
    color: '#c53030',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 14,
  },
  placeholder: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default Analytics;
