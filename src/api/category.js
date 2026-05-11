import apiClient from "./client";
import { API_ENDPOINTS } from "./constants";

export const categoryAPI = {
  getCategories: async () => {
    return apiClient.get(API_ENDPOINTS.CATEGORY_GET);
  },
};
