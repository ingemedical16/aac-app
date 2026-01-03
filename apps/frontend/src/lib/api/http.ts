// src/lib/api/http.ts
import axios, { AxiosHeaders } from "axios";
import i18next from "i18next";
import { tokenStorage } from "@/lib/auth/tokenStorage";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: false,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
http.interceptors.request.use((config) => {
  // Ensure headers is an AxiosHeaders instance
  config.headers = AxiosHeaders.from(config.headers);

  const token = tokenStorage.get();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  config.headers.set("Accept-Language", i18next.language || "en");

  return config;
});
