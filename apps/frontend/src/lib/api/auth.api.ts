// src/lib/api/auth.api.ts
import { http } from "@/lib/api/http";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import type {
  LoginInput,
  RegisterInput,
  RefreshInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
} from "@/types/auth";

/**
 * AUTH API (client-side convenience layer)
 * - Calls backend endpoints via the central axios client
 * - Persists JWT access_token to localStorage on login/register/refresh
 * - Clears token on logout
 *
 * Note: tokenStorage is a browser-only store. These helpers should be called
 * from client components/hooks (not SSR).
 */

/* =========================
   Core helpers
========================= */

function persistToken(data: Partial<AuthResponse> | any) {
  const token = data?.access_token;
  if (typeof token === "string" && token.length > 0) {
    tokenStorage.set(token);
  }
}

function clearToken() {
  tokenStorage.clear();
}

/* =========================
   Auth endpoints
========================= */

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", input);
  persistToken(data);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/register", input);
  persistToken(data);
  return data;
}

/**
 * If your backend uses refresh tokens in cookies, you likely need:
 *   - http.withCredentials = true
 *   - cookie SameSite=None; Secure
 *
 * If your backend expects refresh input in the body, this is fine as-is.
 */
export async function refresh(input: RefreshInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/refresh", input);
  persistToken(data);
  return data;
}

export async function logout(): Promise<unknown> {
  // Some backends require Authorization for logout; interceptor will attach it.
  const { data } = await http.post("/auth/logout");
  clearToken();
  return data;
}

export async function me<T = unknown>(): Promise<T> {
  const { data } = await http.get<T>("/auth/me");
  return data;
}

/* =========================
   Password flows
========================= */

export async function changePassword(input: ChangePasswordInput): Promise<unknown> {
  const { data } = await http.post("/auth/change-password", input);
  return data;
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<unknown> {
  const { data } = await http.post("/auth/forgot-password", input);
  return data;
}

export async function resetPassword(input: ResetPasswordInput): Promise<unknown> {
  const { data } = await http.post("/auth/reset-password", input);
  return data;
}

/* =========================
   Utilities (optional)
========================= */

export function getStoredToken(): string | null {
  return tokenStorage.get();
}

export function clearStoredToken() {
  clearToken();
}
