import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/global.css';

function CommunityTab({ currentUser }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/social/leaderboard');
        setLeaders(response.data);
      } catch (err) {
        console.error("Failed to fetch social leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="loading">🌍 Loading global ranks...</div>;

  return (
    <div className="community-panel">
      <h2>🌍 Global Leaderboard</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Check the top 10 most consistent Habit-AI users in the world.</p>
      
      <div className="bento-card col-span-4 stagger-item" style={{animationDelay: '0.1s', padding: '24px'}}>
        {leaders.length === 0 ? (
           <p style={{color: 'var(--text-tertiary)'}}>No users found.</p>
        ) : (
          leaders.map((user, idx) => (
            <div key={user.id} className={`leaderboard-row rank-${idx + 1}`} style={{
                borderLeft: currentUser && currentUser.id === user.id ? '4px solid var(--success)' : undefined,
                background: currentUser && currentUser.id === user.id ? 'rgba(16,185,129,0.05)' : undefined
            }}>
              <div className="rank-number">#{idx + 1}</div>
              <div>
                <h3 style={{fontSize: '20px', margin: 0, color: 'var(--text-primary)'}}>
                   {user.username} {currentUser && currentUser.id === user.id && '(You)'}
                </h3>
                {user.badges && user.badges.length > 0 && (
                   <div style={{display:'flex', gap:'6px', marginTop:'6px'}}>
                      {user.badges.map(b => (
                         <span key={b} style={{fontSize:'11px', background:'rgba(255,255,255,0.05)', padding:'3px 8px', borderRadius:'99px'}}>{b}</span>
                      ))}
                   </div>
                )}
              </div>
              <div style={{textAlign: 'right'}}>
                 <span className="user-level-badge">LVL {user.level || 1}</span>
              </div>
              <div style={{textAlign: 'right', minWidth: '80px'}}>
                 <strong style={{fontSize: '22px', color: 'var(--accent-primary)'}}>{user.exp || 0}</strong> <span style={{fontSize: '12px', color: 'var(--text-tertiary)'}}>EXP</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityTab;
