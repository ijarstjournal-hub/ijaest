import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('ijarst_token');
    const email = localStorage.getItem('ijarst_email');
    if (token && email) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAdmin({ email, token });
    }
    setLoading(false);
  }, []);

  const login = useCallback((token, email) => {
    localStorage.setItem('ijarst_token', token);
    localStorage.setItem('ijarst_email', email);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin({ email, token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ijarst_token');
    localStorage.removeItem('ijarst_email');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  }, []);

  const isAuthenticated = Boolean(admin);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
