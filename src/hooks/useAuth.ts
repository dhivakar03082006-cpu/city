/**
 * CityPulse - Authentication Hook
 */

import { useState, useEffect } from 'react';
import { User } from '../types/index';
import { ApiService } from '../services/api';

const AUTH_STORAGE_KEY = 'citypulse_auth_session';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token && parsed.user) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth token from localStorage');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await ApiService.login(credentials);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  const register = async (userData: { full_name: string; email: string; password: string }) => {
    const data = await ApiService.register(userData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };
}
