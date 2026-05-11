import apiClient from "./client";
import { API_ENDPOINTS } from "./constants";

export const generatorAPI = {
  getGeneratedPhotos: async () => {
    return apiClient.get(API_ENDPOINTS.GENERATE_PHOTOS_GET);
  },

  generatePhotos: async (data) => {
    const formData = new FormData();

    formData.append("categoryId", data.categoryId);
    formData.append("environment", data.environment);
    formData.append("poseCount", data.poseCount);

    data.options.forEach((item, index) => {
      formData.append(`options[${index}][option]`, item.option);
      formData.append(`options[${index}][file]`, item.file);
    });

    return apiClient.post(API_ENDPOINTS.GENERATE_PHOTOS_POST, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  downloadPhoto: async (photoUrl, filename) => {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "image.png";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};
