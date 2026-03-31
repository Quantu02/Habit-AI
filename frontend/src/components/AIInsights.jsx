import React, { useEffect, useState } from 'react';
import AI_SERVICE from '../services/aiService';
import '../styles/global.css';

function AIInsights({ habits }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        // First get analytics and brain analysis
        const [analytics, brainsResults] = await Promise.all([
          AI_SERVICE.getAnalytics(habits),
          AI_SERVICE.analyzeHabits(habits),
        ]);

        // Then get insights
        const insightsData = await AI_SERVICE.getInsights(
          habits,
          brainsResults.results,
          analytics
        );

        setInsights(insightsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (habits && habits.length > 0) {
      fetchInsights();
    }
  }, [habits]);

  if (loading) return <div className="loading">Analyzing your habits...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!insights) return <div>No insights available</div>;

  return (
    <div className="ai-insights" style={{marginTop: '32px'}}>
      <h2>🤖 Neural Synthesis</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Daily AI-driven observations spanning your entire routine.</p>

      <div className="bento-grid">
        {/* Summary */}
        {insights.summary && (
          <div className="bento-card col-span-4 stagger-item" style={{animationDelay: '0.1s', display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'center'}}>
            <div style={{flex: 1}}>
              <h3 style={{marginBottom: '8px', color: 'var(--accent-primary)', fontSize: '18px'}}>Top Performer</h3>
              <p style={{fontSize: '32px', fontWeight: 800}}>{insights.summary.top_performer?.habit || '—'}</p>
            </div>
            <div style={{width: '2px', height: '60px', background: 'var(--border-glass)'}}></div>
            <div style={{flex: 1}}>
              <h3 style={{marginBottom: '8px', color: 'var(--accent-secondary)', fontSize: '18px'}}>Average Score</h3>
              <p style={{fontSize: '32px', fontWeight: 800}}>{insights.summary.avg_score || 0}<span style={{fontSize:'16px', color:'var(--text-tertiary)'}}>/100</span></p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insights.recommendations && insights.recommendations.length > 0 && (
          <div className="bento-card col-span-2 stagger-item" style={{animationDelay: '0.2s'}}>
            <h3 style={{marginBottom: '20px', fontSize: '20px'}}>💡 Tactical Recommendations</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {insights.recommendations.map((rec, idx) => (
                <div key={idx} style={{background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', borderLeft: '3px solid var(--accent-primary)'}}>
                  <p style={{marginBottom: '12px', lineHeight: 1.5, color: 'var(--text-primary)'}}>{rec.message}</p>
                  <span className={`priority-badge priority-${rec.priority}`} style={{marginTop: 0, display: 'inline-block'}}>{rec.priority} Priority</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patterns */}
        {insights.patterns && insights.patterns.length > 0 && (
          <div className="bento-card col-span-2 stagger-item" style={{animationDelay: '0.3s'}}>
            <h3 style={{marginBottom: '20px', fontSize: '20px'}}>📊 Detected Patterns</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {insights.patterns.map((pattern, idx) => (
                <div key={idx} style={{background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', borderLeft: '3px solid var(--accent-secondary)'}}>
                  <p style={{lineHeight: 1.5, color: 'var(--text-primary)'}}>{pattern.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerts */}
        {insights.alerts && insights.alerts.length > 0 && (
          <div className="bento-card col-span-4 stagger-item" style={{animationDelay: '0.4s', border: '1px solid rgba(239, 68, 68, 0.3)'}}>
             <h3 style={{marginBottom: '20px', color: 'var(--danger)', fontSize: '20px'}}>⚠️ Critical Alerts</h3>
             <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
                {insights.alerts.map((alert, idx) => (
                  <div key={idx} style={{background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '16px'}}>
                    <strong style={{display:'block', marginBottom:'6px', color: 'var(--text-primary)'}}>{alert.habit || 'System'}:</strong>
                    <span style={{color: 'var(--text-secondary)'}}>{alert.message}</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIInsights;
