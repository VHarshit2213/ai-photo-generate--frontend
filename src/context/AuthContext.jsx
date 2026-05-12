import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import { USER_KEY } from '../api/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from the API so profile data stays fresh.
  useEffect(() => {
    const loadProfile = async () => {
      if (!authAPI.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const response = await authAPI.getProfile();
        const profile = response?.data || response;
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      } catch (err) {
        authAPI.logout();
        setUser(null);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const value = {
    user,
    loading,
    error,
    setUser,
    setLoading,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
