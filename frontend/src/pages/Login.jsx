import React, { useState } from 'react';
import api from '../services/api';
import '../styles/global.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        // Register new user
        await api.post('/auth/register', {
          email,
          username,
          password,
        });
        // Auto-login after registration
        handleLogin(email, password);
      } else {
        // Login existing user
        handleLogin(email, password);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loginEmail, loginPassword) => {
    try {
      const response = await api.post('/auth/login', {
        email: loginEmail,
        password: loginPassword,
      });

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(access_token);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      throw err;
    }
  };

  return (
    <>
      <div className="ambient-background">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>
      <div className="login-container" style={{ zIndex: 10, position: 'relative' }}>
        <div className="bento-card login-box stagger-item" style={{ animationDelay: '0.1s', border: '1px solid var(--border-glass)', padding: '48px', maxWidth: '480px', width: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '42px', margin: 0, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <span style={{ filter: 'hue-rotate(240deg) drop-shadow(0 0 10px rgba(99,102,241,0.5))', WebkitTextFillColor: 'initial' }}>🎯</span> Habit-AI
            </h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '14px', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '12px', fontWeight: 600 }}>Next-Gen Protocol</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <h2 style={{ fontSize: '22px', color: 'var(--text-primary)', marginBottom: '24px', textAlign: 'center', fontWeight: '400' }}>
              {isRegister ? 'Initialize New Node' : 'Authenticate Session'}
            </h2>

            {error && <div className="error-card stagger-item" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '16px', borderRadius: '12px', border: '1px solid var(--danger)', marginBottom: '24px', fontSize: '13px', textAlign: 'center', animationDelay: '0.2s' }}>{error}</div>}

            {isRegister && (
              <div className="form-group stagger-item" style={{ animationDelay: '0.2s', marginBottom: '20px' }}>
                <label htmlFor="username" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>👤 Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="PlayerOne"
                  required
                  disabled={loading}
                  style={{ width: '100%', padding: '16px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '16px', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 15px var(--accent-shadow)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div className="form-group stagger-item" style={{ animationDelay: '0.3s', marginBottom: '20px' }}>
              <label htmlFor="email" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>✉️ Secure Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@habit.ai"
                required
                disabled={loading}
                style={{ width: '100%', padding: '16px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '16px', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 15px var(--accent-shadow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div className="form-group stagger-item" style={{ animationDelay: '0.4s', marginBottom: '32px' }}>
              <label htmlFor="password" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '4px' }}>🔑 Encryption Key</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{ width: '100%', padding: '16px', marginTop: '8px', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)', borderRadius: '16px', fontSize: '15px', outline: 'none', transition: 'border-color 0.3s, box-shadow 0.3s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 15px var(--accent-shadow)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-glass)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              className="auth-button stagger-item"
              disabled={loading}
              style={{ width: '100%', animationDelay: '0.5s', padding: '18px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700', borderRadius: '16px' }}
            >
              {loading
                ? 'Establishing Connection...'
                : isRegister
                  ? 'Deploy New Node'
                  : 'Enter Vault'}
            </button>
          </form>

          <div className="login-footer stagger-item" style={{ animationDelay: '0.6s', marginTop: '32px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>
              {isRegister
                ? 'Already initialized? '
                : "No access sequence? "}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setEmail('');
                  setPassword('');
                  setUsername('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', textDecoration: 'underline' }}
                disabled={loading}
              >
                {isRegister ? 'Engage Existing' : 'Create Access Node'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
