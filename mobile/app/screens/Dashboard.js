import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import api from '../services/api';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      // Connect to the backend
      const response = await api.get('/habits/');
      setHabits(response.data);
    } catch (err) {
      setError('Failed to load habits. Check connection.');
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    try {
      const response = await api.post('/habits/', {
        name: newHabitName.trim(),
        difficulty: 3,
        category: null,
      });
      setHabits([...habits, response.data]);
      setNewHabitName('');
    } catch (err) {
      setError('Failed to create habit');
    }
  };

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const markHabitComplete = async (habitId) => {
    try {
      const response = await api.post(`/habits/${habitId}/log`);
      setHabits(habits.map((h) => (h.id === habitId ? response.data : h)));
    } catch (err) {
      setError('Failed to log completion');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={{color:'#64748b', marginTop: 12}}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎯 Dashboard</Text>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Card title="📊 Quick Stats">
          <View style={styles.statsRow}>
            <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.statBox} start={{x:0,y:0}} end={{x:1,y:1}}>
              <Text style={styles.statValue}>{habits.length}</Text>
              <Text style={styles.statLabel}>Active Habits</Text>
            </LinearGradient>
            <LinearGradient colors={['#3b82f6', '#2dd4bf']} style={styles.statBox} start={{x:0,y:0}} end={{x:1,y:1}}>
              <Text style={styles.statValue}>
                {habits.reduce((sum, h) => sum + (h.streak || 0), 0)}
              </Text>
              <Text style={styles.statLabel}>Total Streak</Text>
            </LinearGradient>
          </View>
        </Card>

        <Card title="✨ Add New Habit">
          <View style={styles.addHabitContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 10 Pages..."
              value={newHabitName}
              onChangeText={setNewHabitName}
              placeholderTextColor="#64748b"
            />
            <TouchableOpacity style={styles.addButton} onPress={addHabit}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card title="🎯 Today's Goals">
          {habits.length === 0 ? (
            <Text style={styles.emptyText}>You haven't added any habits yet.</Text>
          ) : (
            habits.map((habit) => {
              const isLoggedToday = habit.log && habit.log[getTodayKey()];
              return (
                <View key={habit.id} style={styles.habitItem}>
                  <View style={styles.habitDetails}>
                    <Text style={[styles.habitName, isLoggedToday && styles.habitNameDone]}>
                      {habit.name}
                    </Text>
                    <Text style={styles.habitMeta}>
                      🔥 {habit.streak || 0} days streak 
                      {habit.category ? ` • 📂 ${habit.category}` : ''}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.completeBtn, isLoggedToday && styles.completeBtnDone]}
                    onPress={() => markHabitComplete(habit.id)}
                    disabled={isLoggedToday}
                  >
                    <Text style={styles.completeBtnText}>{isLoggedToday ? '✓' : ''}</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // very dark midnight blue
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  addHabitContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#f8fafc',
  },
  addButton: {
    backgroundColor: '#6366f1',
    width: 54,
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 32,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 24,
  },
  habitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  habitDetails: {
    flex: 1,
    paddingRight: 16,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f8fafc',
  },
  habitNameDone: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  habitMeta: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
  },
  completeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  completeBtnDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  completeBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});

export default Dashboard;
