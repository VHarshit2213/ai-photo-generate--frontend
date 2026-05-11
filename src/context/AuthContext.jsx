import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth from localStorage
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser && authAPI.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
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
