import React, { useState, useEffect } from 'react';
import AI_SERVICE from '../services/aiService';
import '../styles/global.css';

function BrainPanel({ habits }) {
  const [brainResults, setBrainResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrainAnalysis = async () => {
      try {
        setLoading(true);
        const results = await AI_SERVICE.analyzeHabits(habits);
        setBrainResults(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (habits && habits.length > 0) {
      fetchBrainAnalysis();
    }
  }, [habits]);

  if (loading) return <div className="loading">🧠 Brain analyzing...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!brainResults || !brainResults.results) return <div>No brain data available</div>;

  return (
    <div className="brain-panel">
      <h2>🧠 Active Brain Synapses</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Real-time neural feedback on your habit difficulty balance.</p>
      
      <div className="bento-grid">
        {brainResults.results.map((result, idx) => (
          <div key={idx} className="bento-card col-span-2 stagger-item" style={{animationDelay: `${idx * 0.1}s`, gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <h3 style={{fontSize: '22px', marginBottom: '4px'}}>{result.habit}</h3>
                <span style={{color: 'var(--text-secondary)', fontSize: '14px', textTransform:'uppercase', letterSpacing:'1px', fontWeight:600}}>Difficulty: {result.difficulty}</span>
              </div>
              <div style={{textAlign: 'right'}}>
                <span style={{fontSize: '32px', fontWeight: 800, color: 'var(--accent-secondary)'}}>{result.score}<span style={{fontSize: '16px', color: 'var(--text-tertiary)'}}>/100</span></span>
              </div>
            </div>
            
            <div className="difficulty-bar" style={{marginTop: 'auto', background: 'rgba(255,255,255,0.05)', height: '12px'}}>
              <div
                className="difficulty-fill"
                style={{ width: `${result.score}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BrainPanel;
