// src/lib/api/http.ts
import axios, { AxiosHeaders } from "axios";
import i18next from "i18next";

/**
 * Central HTTP client (cookie-based auth)
 * - HttpOnly cookie session (access_token)
 * - i18n Accept-Language propagation
 */
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  withCredentials: true, // send cookies cross-site
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
http.interceptors.request.use(
  (config) => {
    config.headers = AxiosHeaders.from(config.headers);

    // Attach current language for backend i18n
    config.headers.set("Accept-Language", i18next.language || "en");

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
