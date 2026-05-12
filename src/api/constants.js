export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
export const BE_IMG_URL =
  "https://game-linoleum-patchy.ngrok-free.dev" || "http://localhost:3000";
export const TOKEN_KEY = "taxtail_auth_token";
export const USER_KEY = "taxtail_user";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/auth/signin",
  AUTH_REGISTER: "/auth/signup",
  AUTH_PROFILE: "/auth/profile", // GET,PUT
  AUTH_RESET_PASSWORD: "/auth/reset-password",

  // Category
  CATEGORY_GET: "/category",

  // Photo Generation
  GENERATE_PHOTOS_GET: "/image-generate",
  GENERATE_PHOTOS_POST: "/image-generate",
};
