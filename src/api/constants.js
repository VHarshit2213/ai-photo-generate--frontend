export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const TOKEN_KEY = "taxtail_auth_token";
export const USER_KEY = "taxtail_user";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/api/auth/signin",
  AUTH_REGISTER: "/api/auth/signup",
  AUTH_PROFILE: "/api/auth/profile", // GET,PUT
  AUTH_RESET_PASSWORD: "/api/auth/reset-password",

  // Category
  CATEGORY_GET: "/api/category",

  // Photo Generation
  GENERATE_PHOTOS_GET: "/api/image-generate",
  GENERATE_PHOTOS_POST: "/api/image-generate",
};
