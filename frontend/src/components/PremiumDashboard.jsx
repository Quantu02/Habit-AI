import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/global.css';

export default function PremiumDashboard({ habits }) {
  const [data, setData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!habits || habits.length === 0) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const [analyticsRes, recsRes] = await Promise.all([
          api.post('/analytics/', { habits }),
          api.post('/ai/recommendations', { habits }),
        ]);

        setData(analyticsRes.data);
        setRecommendations(recsRes.data.recommendations || []);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [habits]);

  if (loading) return <div className="loading">💎 Loading premium analytics...</div>;
  if (error) return <div className="error-banner">Error: {error}</div>;
  if (!habits || habits.length === 0) {
    return (
      <div className="premium-empty">
        <p>📊 Add some habits first to see premium analytics!</p>
      </div>
    );
  }
  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="premium-dashboard">
      <h2>💎 AI Analytics</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Your personalized data translated into actionable insights.</p>

      <div className="bento-grid">
        {/* Top Stats */}
        <div className="bento-card col-span-2">
          <span className="bento-label">Avg Consistency</span>
          <span className="bento-stat-num">{data.summary?.avg_consistency ?? 0}%</span>
        </div>
        <div className="bento-card col-span-1" style={{background: 'linear-gradient(180deg, rgba(245,158,11,0.05), transparent)'}}>
          <span className="bento-label">Burnouts</span>
          <span className="bento-stat-num" style={{color: 'var(--warning)', background:'none', WebkitTextFillColor:'var(--warning)'}}>{data.burnout_risk?.length ?? 0}</span>
        </div>
        <div className="bento-card col-span-1">
          <span className="bento-label">Tracked</span>
          <span className="bento-stat-num" style={{background:'none', WebkitTextFillColor:'var(--text-primary)'}}>{data.impact_scores?.length ?? 0}</span>
        </div>

        {/* Best/Worst Tiles */}
        <div className="bento-card col-span-2 row-span-2 stagger-item" style={{animationDelay: '0.1s', border: '1px solid rgba(16,185,129,0.2)'}}>
          <h3 style={{fontSize: '22px', marginBottom: '8px'}}>🏆 Top Performer</h3>
          <p style={{fontSize: '36px', fontWeight: 800, color: 'var(--success)'}}>{data.best || '—'}</p>
          <div style={{flex: 1}}></div>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginTop: '16px'}}>Maintaining this habit drives the most positive momentum in your routine.</p>
        </div>

        <div className="bento-card col-span-2 row-span-2 stagger-item" style={{animationDelay: '0.2s', border: '1px solid rgba(239,68,68,0.2)'}}>
          <h3 style={{fontSize: '22px', marginBottom: '8px'}}>📉 Needs Work</h3>
          <p style={{fontSize: '36px', fontWeight: 800, color: 'var(--danger)'}}>{data.worst || '—'}</p>
          <div style={{flex: 1}}></div>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px', marginTop: '16px'}}>Focus here next week to drastically improve your average consistency.</p>
        </div>

        {/* Impact Scores & Risks */}
        <div className="bento-card col-span-4 stagger-item" style={{animationDelay: '0.3s', padding: 0, overflow: 'hidden', background: 'transparent', border: 'none', boxShadow: 'none'}}>
          <div className="insights-row" style={{margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
            
            {/* Left: Impact Scores */}
            <div className="bento-card" style={{margin: 0}}>
              <h3 style={{marginBottom: '20px'}}>🔥 Impact Ranking</h3>
              {data.impact_scores && data.impact_scores.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {data.impact_scores.map((h, i) => (
                    <div key={i}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                        <span style={{fontWeight: 600}}>{h.habit}</span>
                        <span style={{color: 'var(--accent-secondary)', fontWeight: 700}}>{h.impact}%</span>
                      </div>
                      <div className="difficulty-bar">
                        <div className="difficulty-fill" style={{ width: `${Math.min(h.impact, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                 <p style={{color: 'var(--text-tertiary)'}}>Not enough data to calculate impact.</p>
              )}
            </div>

            {/* Right: Recommendations & Risks */}
            <div className="bento-card" style={{margin: 0}}>
              <h3 style={{marginBottom: '20px', fontSize: '20px'}}>💡 AI Strategy</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                {data.burnout_risk && data.burnout_risk.map((h, i) => (
                  <div key={`risk-${i}`} className="alert-card" style={{margin: 0, padding: '16px', borderRadius: '16px', fontSize: '15px'}}>
                    <span style={{color: 'var(--danger)'}}>⚠️ <strong>{h}</strong> shows high burnout risk.</span>
                  </div>
                ))}
                
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                  <div key={`rec-${i}`} style={{background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', borderLeft: '4px solid var(--accent-primary)'}}>
                    <p style={{marginBottom: '12px', lineHeight: 1.6, fontSize: '16px', color: 'var(--text-primary)'}}>{rec.message}</p>
                    <span className={`priority-badge priority-${rec.priority}`} style={{marginTop: 0, display: 'inline-block'}}>
                      {rec.priority} Priority
                    </span>
                  </div>
                )) : (
                  <p style={{color: 'var(--text-tertiary)', fontSize: '15px'}}>Keep logging habits to receive personalized strategies!</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}