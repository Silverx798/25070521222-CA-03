import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check current session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('mythos_token');
      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
        } catch (err) {
          console.warn('[Auth] Session invalid or expired:', err.message);
          localStorage.removeItem('mythos_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const register = async (displayName, email, password) => {
    setAuthError(null);
    try {
      const data = await registerUser({ displayName, email, password });
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, login, register, logout, setAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
