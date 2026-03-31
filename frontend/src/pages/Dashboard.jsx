import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AIInsights from '../components/AIInsights';
import BrainPanel from '../components/BrainPanel';
import PremiumDashboard from '../components/PremiumDashboard';
import CommunityTab from '../components/CommunityTab';
import HeatMap from '../components/HeatMap';
import GrowthChart from '../components/GrowthChart';
import FocusTimer from '../components/FocusTimer';
import '../styles/global.css';

function Dashboard({ onLogout }) {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDifficulty, setNewDifficulty] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') !== 'light');
  const [colorTheme, setColorTheme] = useState(localStorage.getItem('colorTheme') || 'indigo');

  useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
    if (colorTheme === 'indigo') {
        document.body.removeAttribute('data-color-theme');
    } else {
        document.body.setAttribute('data-color-theme', colorTheme);
    }
  }, [colorTheme]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } catch (_) {}
    }
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/habits/');
      setHabits(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    try {
      const response = await api.post('/habits/', {
        name: newHabit.trim(),
        difficulty: newDifficulty,
        category: newCategory.trim() || null,
      });
      setHabits([...habits, response.data]);
      setNewHabit('');
      setNewCategory('');
      setNewDifficulty(3);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add habit');
    }
  };

  const handleLogComplete = async (habitId) => {
    try {
      const response = await api.post(`/habits/${habitId}/log`);
      setHabits(habits.map((h) => (h.id === habitId ? response.data : h)));
      
      // V2: Refresh user data to get updated EXP & Level!
      try {
         const userRes = await api.get('/auth/me');
         setUser(userRes.data);
         localStorage.setItem('user', JSON.stringify(userRes.data));
      } catch (err) {}
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log completion');
    }
  };

  const handleRefetchData = async () => {
    await fetchHabits();
    try {
       const userRes = await api.get('/auth/me');
       setUser(userRes.data);
       localStorage.setItem('user', JSON.stringify(userRes.data));
    } catch(err) {}
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Delete this habit?')) return;
    try {
      await api.delete(`/habits/${habitId}`);
      setHabits(habits.filter((h) => h.id !== habitId));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete habit');
    }
  };

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <>
      <div className="ambient-background">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>
      <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ filter: 'hue-rotate(240deg) drop-shadow(0 0 10px rgba(99,102,241,0.5))', WebkitTextFillColor: 'initial' }}>🎯</span> Habit-AI Dashboard
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {user && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', marginRight: '8px' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                 {user.username} <span className="user-level-badge" style={{marginLeft: '6px', fontSize: '11px'}}>LV {user.level || 1}</span>
              </span>
              <div className="exp-bar-container">
                 <div className="exp-fill" style={{ width: `${user.exp || 0}%` }} title={`${user.exp || 0}/100 to next level`}></div>
              </div>
            </div>
          )}
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
             <select 
               value={colorTheme} 
               onChange={(e) => setColorTheme(e.target.value)}
               title="Change UI Theme"
               style={{padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '20px', cursor: 'pointer', outline: 'none', appearance: 'none'}}
             >
                <option value="indigo" style={{color: '#6366f1'}}>🌌 Indigo</option>
                <option value="cyberpunk" style={{color: '#eab308'}}>⚡ Cyberpunk</option>
                <option value="sunset" style={{color: '#f97316'}}>🌅 Sunset</option>
                <option value="toxic" style={{color: '#10b981'}}>☣️ Toxic</option>
             </select>
             <button 
               onClick={() => setIsDark(!isDark)} 
               className="theme-toggle-btn"
               title="Toggle Light/Dark Theme"
             >
               {isDark ? '☀️' : '🌙'}
             </button>
          </div>
          <button id="logout-btn" onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>✕</button>
        </div>
      )}

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <nav className="dashboard-nav">
          <button
            id="tab-overview"
            className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            id="tab-brain"
            className={`nav-btn ${activeTab === 'brain' ? 'active' : ''}`}
            onClick={() => setActiveTab('brain')}
          >
            🧠 AI Brain
          </button>
          <button
            id="tab-focus"
            className={`nav-btn ${activeTab === 'focus' ? 'active' : ''}`}
            onClick={() => setActiveTab('focus')}
          >
            ⏱️ Deep Focus
          </button>
          <button
            id="tab-premium"
            className={`nav-btn ${activeTab === 'premium' ? 'active' : ''}`}
            onClick={() => setActiveTab('premium')}
          >
            💎 Premium
          </button>
          <button
            id="tab-habits"
            className={`nav-btn ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            🎯 My Habits
          </button>
          <button
            id="tab-community"
            className={`nav-btn ${activeTab === 'community' ? 'active' : ''}`}
            onClick={() => setActiveTab('community')}
          >
            🌍 Community
          </button>
        </nav>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <section>
              <h2>Welcome Back{user ? `, ${user.username}` : ''}!</h2>
              <p>Manage your habits and track your progress with AI-powered insights.</p>
              <div className="bento-grid" style={{marginTop: '32px', marginBottom: '32px'}}>
                <div className="bento-card col-span-1 stagger-item" style={{animationDelay: '0.1s'}}>
                  <span className="bento-label">Active Habits</span>
                  <span className="bento-stat-num">{habits.length}</span>
                </div>
                <div className="bento-card col-span-1 stagger-item" style={{animationDelay: '0.2s', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)'}}>
                  <span className="bento-label">Total Streaks</span>
                  <span className="bento-stat-num" style={{WebkitTextFillColor: 'var(--text-primary)'}}>
                    {habits.reduce((sum, h) => sum + (h.streak || 0), 0)}
                  </span>
                </div>
                <div className="bento-card col-span-1 stagger-item" style={{animationDelay: '0.3s'}}>
                  <span className="bento-label">Done Today</span>
                  <span className="bento-stat-num">
                    {habits.filter((h) => h.log && h.log[getTodayKey()]).length}
                  </span>
                </div>
                <div className="bento-card col-span-1 stagger-item" style={{animationDelay: '0.4s', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)'}}>
                  <span className="bento-label">Today's Rate</span>
                  <span className="bento-stat-num" style={{WebkitTextFillColor: 'var(--success)'}}>
                    {habits.length > 0
                      ? Math.round(
                          (habits.filter((h) => h.log && h.log[getTodayKey()]).length /
                            habits.length) *
                            100
                        )
                      : 0}%
                  </span>
                </div>
              </div>

              {habits.length > 0 && (
                <div className="bento-grid" style={{marginBottom: '32px'}}>
                   <HeatMap habits={habits} />
                </div>
              )}

              {habits.length > 0 && (
                <div className="bento-grid" style={{marginBottom: '32px'}}>
                   <GrowthChart habits={habits} />
                </div>
              )}

              {habits.length > 0 && <AIInsights habits={habits} />}
            </section>
          )}

          {activeTab === 'brain' && <BrainPanel habits={habits} />}

          {activeTab === 'focus' && <FocusTimer habits={habits} onLogComplete={handleRefetchData} />}

          {activeTab === 'premium' && <PremiumDashboard habits={habits} />}
          
          {activeTab === 'community' && <CommunityTab currentUser={user} />}

          {/* My Habits Tab */}
          {activeTab === 'habits' && (
            <section>
              <h2>My Habits</h2>
              <form id="add-habit-form" onSubmit={handleAddHabit} className="add-habit-form">
                <input
                  id="habit-name-input"
                  type="text"
                  placeholder="Habit name (e.g. Morning Run)..."
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  className="habit-input"
                  required
                />
                <input
                  id="habit-category-input"
                  type="text"
                  placeholder="Category (optional)..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="habit-input"
                  style={{ marginTop: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Difficulty (1–5):
                  </label>
                  <input
                    id="habit-difficulty-input"
                    type="number"
                    min="1"
                    max="5"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(Number(e.target.value))}
                    style={{ width: '60px', padding: '6px 8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                  />
                </div>
                <button id="add-habit-btn" type="submit" className="btn-primary" style={{ marginTop: '12px' }}>
                  + Add Habit
                </button>
              </form>

              <div className="habits-list" style={{ marginTop: '24px' }}>
                {habits.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>
                    No habits yet. Create your first habit above!
                  </p>
                ) : (
                  habits.map((habit, index) => {
                    const isLoggedToday = habit.log && habit.log[getTodayKey()];
                    const onFireClass = (habit.streak && habit.streak >= 3) ? 'on-fire' : '';
                    return (
                      <div 
                        key={habit.id} 
                        className={`habit-card stagger-item ${onFireClass}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="habit-header">
                          <div>
                            <h3>{habit.name}</h3>
                            {habit.category && (
                              <small style={{ color: 'var(--text-secondary)' }}>
                                📂 {habit.category}
                              </small>
                            )}
                          </div>
                          <span className="streak">🔥 {habit.streak || 0} days</span>
                        </div>
                        <div className="habit-body">
                          <p>Difficulty: Level {habit.difficulty}/5</p>
                          <div className="difficulty-bar">
                            <div
                              className="difficulty-fill"
                              style={{ width: `${habit.difficulty * 20}%` }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button
                            onClick={() => handleLogComplete(habit.id)}
                            className={isLoggedToday ? 'btn-secondary' : 'btn-primary'}
                            disabled={isLoggedToday}
                            style={{ flex: 1 }}
                          >
                            {isLoggedToday ? '✅ Done Today' : 'Mark Complete'}
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.id)}
                            className="btn-secondary"
                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
