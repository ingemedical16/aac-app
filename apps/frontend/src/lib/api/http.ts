// src/lib/api/http.ts
import axios, { AxiosHeaders } from "axios";
import i18next from "i18next";
import { tokenStorage } from "@/lib/auth/tokenStorage";

/**
 * Central HTTP client
 * - JWT Bearer authentication
 * - i18n Accept-Language propagation
 * - Backend-first API strategy
 */
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: false, // JWT via Authorization header
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
http.interceptors.request.use(
  (config) => {
    // Ensure AxiosHeaders instance (Axios v1 safety)
    config.headers = AxiosHeaders.from(config.headers);

    // Attach JWT if present
    const token = tokenStorage.get();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Attach current language for backend i18n
    config.headers.set(
      "Accept-Language",
      i18next.language || "en"
    );

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR (SAFE)
========================= */
/**
 * Central place for future enhancements:
 * - Auto logout on 401
 * - Token refresh
 * - Global error normalization
 *
 * Currently passive by design.
 */
http.interceptors.response.use(
  (response) => {
    return response},
  (error) => Promise.reject(error)
);