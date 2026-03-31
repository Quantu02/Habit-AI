import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/global.css';

function FocusTimer({ habits, onLogComplete }) {
  const [selectedHabit, setSelectedHabit] = useState('');
  const [inputMinutes, setInputMinutes] = useState(25);

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      // Allow custom time changes while idle
      const num = parseInt(inputMinutes);
      if (!isNaN(num) && num > 0) {
        setTimeLeft(num * 60);
      }
    }
  }, [inputMinutes, isRunning]);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      clearInterval(interval);
      setIsRunning(false);
      handleTimerComplete();
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    if (!selectedHabit) {
      alert("🚨 Time up! You crushed your focused session.\n\n(Tip: Next time, assign a Habit from the dropdown to automatically earn EXP when the timer finishes!)");
      return;
    }

    try {
      // Fire autonomous tracking!
      await api.post(`/habits/${selectedHabit}/log`);
      alert("✅ Deep Focus Session Complete!\n\nYour assigned Habit has been logged, streaks updated, and massive EXP awarded!");

      // Notify Dashboard.jsx to refetch state
      if (onLogComplete) onLogComplete(selectedHabit);
    } catch (err) {
      console.error(err);
      alert("Failed to autonomously log habit completion. Ensure backend is running!");
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const num = parseInt(inputMinutes) || 25;
    setTimeLeft(num * 60);
  };

  // Convert to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="focus-panel stagger-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', width: '100%', animationDelay: '0.1s' }}>

      <div className="bento-card col-span-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%', maxWidth: '740px', padding: '56px 40px', margin: '0 auto', background: 'var(--bg-surface-glass)', backdropFilter: 'blur(30px)', border: isRunning ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: isRunning ? '0 0 40px var(--accent-shadow)' : 'var(--shadow-lg)', borderRadius: '32px' }}>

        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '32px', margin: 0, textTransform: 'uppercase', letterSpacing: '6px', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Deep Work Engine</h2>
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '12px', fontSize: '13px', letterSpacing: '3px', fontWeight: 600 }}>AUTONOMOUS EXECUTION PROTOCOL</p>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedHabit}
            onChange={e => setSelectedHabit(e.target.value)}
            disabled={isRunning}
            title="Select Target Node"
            style={{ flex: 1, minWidth: '240px', padding: '18px 24px', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '20px', fontSize: '15px', outline: 'none', transition: 'all 0.3s ease', cursor: isRunning ? 'not-allowed' : 'pointer' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 15px var(--accent-shadow)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
          >
            <option value="">-- Assign Target Node (Optional) --</option>
            {habits.map(h => (
              <option key={h.id} value={h.id} style={{ color: '#0f172a' }}>{h.name}</option>
            ))}
          </select>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              max="240"
              value={inputMinutes}
              onChange={e => setInputMinutes(e.target.value)}
              disabled={isRunning}
              style={{ width: '130px', padding: '18px', background: 'rgba(0,0,0,0.4)', color: 'var(--accent-primary)', border: '1px solid var(--border-glass)', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px', outline: 'none', transition: 'all 0.3s ease' }}
              title="Inject Master Clock (Minutes)"
              onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 15px var(--accent-shadow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
            />
            <span style={{ position: 'absolute', right: '16px', color: 'var(--text-tertiary)', fontSize: '12px', fontWeight: 'bold', pointerEvents: 'none' }}>MIN</span>
          </div>
        </div>

        {/* RADIAL CLOCK ELEMENT */}
        <div style={{ position: 'relative', width: '340px', height: '340px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '32px 0' }}>
          <svg width="340" height="340" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
            {/* Background Orbit */}
            <circle cx="170" cy="170" r="150" stroke="rgba(255,255,255,0.03)" strokeWidth="20" fill="none" />
            {/* Secondary Pulse */}
            <circle cx="170" cy="170" r="150" stroke="var(--accent-primary)" strokeWidth="20" fill="none" opacity={isRunning ? 0.3 : 0} style={{ transition: 'opacity 1s' }} />
            {/* Glowing Active Trail */}
            <circle
              cx="170"
              cy="170"
              r="150"
              stroke="var(--accent-primary)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 150}
              strokeDashoffset={2 * Math.PI * 150 - (timeLeft / ((parseInt(inputMinutes) || 1) * 60)) * (2 * Math.PI * 150)}
              style={{ transition: 'stroke-dashoffset 1s linear', filter: 'drop-shadow(0 0 20px var(--accent-shadow))' }}
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <span style={{ fontSize: '92px', fontWeight: 900, fontFamily: 'Outfit, sans-serif', textShadow: isRunning ? '0 0 30px var(--accent-shadow)' : '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '4px', color: 'var(--text-primary)', transition: 'all 0.5s ease' }}>
              {formatTime(timeLeft)}
            </span>
            <span className="user-level-badge" style={{ marginTop: '16px', opacity: isRunning ? 1 : 0, transition: 'opacity 0.8s ease', padding: '8px 20px', fontSize: '12px', letterSpacing: '2px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--accent-primary)' }}>
              SYNCHRONIZING SECONDS...
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          <button
            className="auth-button"
            style={{ flex: 1, minWidth: '240px', fontSize: '16px', padding: '20px', letterSpacing: '4px', background: isRunning ? 'rgba(239, 68, 68, 0.15)' : 'var(--accent-gradient)', border: isRunning ? '1px solid var(--danger)' : '1px solid transparent', color: isRunning ? 'var(--danger)' : 'white', transition: 'all 0.4s ease', borderRadius: '20px' }}
            onClick={toggleTimer}
          >
            {isRunning ? '⏸️ ABORT ENGINE' : '▶️ ENGAGE SEQUENCE'}
          </button>
          <button
            className="nav-btn"
            style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', minWidth: '140px', letterSpacing: '2px', borderRadius: '20px' }}
            onClick={resetTimer}
          >
            🔄 RESET
          </button>
        </div>

      </div>
    </div>
  );
}

export default FocusTimer;
