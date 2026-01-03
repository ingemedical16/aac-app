import axios from "axios";

/**
 * Central HTTP client for the app
 * - Injects JWT automatically
 * - Handles 401 globally
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Option B (localStorage JWT)
});

/* =========================
   Request Interceptor
========================= */
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* =========================
   Response Interceptor
========================= */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // future: auto logout hook
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);
