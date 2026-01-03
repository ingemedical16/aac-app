import { http } from "./http";

/* =========================
   DTOs
========================= */

export interface RegisterPayload {
  email: string;
  password: string;
  role?: "PARENT" | "PROFESSIONAL" | "PATIENT_ADULT";
  firstName?: string;
  lastName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

/* =========================
   API Calls
========================= */

export const authApi = {
  register(payload: RegisterPayload) {
    return http.post<AuthResponse>("/auth/register", payload);
  },

  login(payload: LoginPayload) {
    return http.post<AuthResponse>("/auth/login", payload);
  },
};
