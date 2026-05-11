import { useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { authAPI } from "../api/auth";
import { toast } from "sonner";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, loading, error, setUser, setLoading, setError } = context;

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authAPI.login(email, password);
        setUser(response);

        return response;
      } catch (err) {
        setError(err.message || "Login failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError],
  );

  const register = useCallback(
    async (email, password, name) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authAPI.register(email, password, name);
        setUser(response.user);
        return response;
      } catch (err) {
        setError(err.message || "Registration failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError],
  );

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
  }, [setUser]);

  const resetPassword = useCallback(
    async (email, newPassword, resetToken) => {
      setLoading(true);
      setError(null);
      try {
        return await authAPI.resetPassword(email, newPassword, resetToken);
      } catch (err) {
        setError(err.message || "Password reset failed");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError],
  );

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    isAuthenticated: !!user,
  };
};
