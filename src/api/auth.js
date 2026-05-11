import apiClient from "./client";
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from "./constants";

export const authAPI = {
  register: async (email, password, name) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH_REGISTER, {
      email,
      password,
      name,
    });
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }
    return response;
  },

  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
      email,
      password,
    });

    if (response.data.accessToken) {
      localStorage.setItem(TOKEN_KEY, response.data.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    }
    return response.data;
  },

  getProfile: async () => {
    return apiClient.get(API_ENDPOINTS.AUTH_PROFILE);
  },

  updateProfile: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return apiClient.put(API_ENDPOINTS.AUTH_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  resetPassword: async (email, newPassword, resetToken) => {
    return apiClient.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, {
      email,
      newPassword,
      resetToken,
    });
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
