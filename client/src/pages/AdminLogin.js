import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/x7k-admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/login', { email, password });
      login(res.data.token, res.data.email);
      navigate('/x7k-admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, color: '#F5C400', letterSpacing: '-0.02em', marginBottom: 4 }}>IJARST</div>
          <div style={{ fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Access</div>
        </div>

        {/* Card */}
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#FAFAFA', marginBottom: 6 }}>Sign In</h2>
          <p style={{ fontSize: 13.5, color: '#666', marginBottom: 28 }}>Editorial dashboard access only.</p>

          {error && (
            <div style={{ background: '#2a1010', border: '1px solid #5c1010', color: '#ff6b6b', padding: '12px 16px', borderRadius: 6, fontSize: 14, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ width: '100%', padding: '11px 14px', background: '#111', border: '1.5px solid #333', borderRadius: 6, color: '#FAFAFA', fontSize: 15, outline: 'none', transition: 'border-color 0.18s' }}
                onFocus={e => e.target.style.borderColor = '#F5C400'}
                onBlur={e => e.target.style.borderColor = '#333'}
                placeholder="admin@example.com"
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '11px 14px', background: '#111', border: '1.5px solid #333', borderRadius: 6, color: '#FAFAFA', fontSize: 15, outline: 'none', transition: 'border-color 0.18s' }}
                onFocus={e => e.target.style.borderColor = '#F5C400'}
                onBlur={e => e.target.style.borderColor = '#333'}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#555' : '#F5C400', color: '#0D0D0D', border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', transition: 'background 0.18s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
            >
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderColor: '#999', borderTopColor: '#333' }} /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#333' }}>This page is not publicly listed.</p>
      </div>
    </div>
  );
}
