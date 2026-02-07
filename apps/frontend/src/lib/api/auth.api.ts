// src/lib/api/auth.api.ts
import { http } from "@/lib/api/http";
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
 * AUTH API (cookie-based)
 * - Uses HttpOnly cookie (access_token) set by the backend
 * - Does NOT persist tokens in localStorage
 * - Requires http.withCredentials = true
 *
 * Note: These helpers should be called from client components/hooks when you
 * rely on browser cookies. (Server-side calls require forwarding cookies.)
 */

/* =========================
   Auth endpoints
========================= */

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/register", input);
  return data;
}

/**
 * If your backend also supports refresh tokens in body, keep RefreshInput.
 * If refresh becomes cookie-only later, you can change this to `refreshApi()`
 * with no input.
 */
export async function refreshApi(input: RefreshInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/refresh", input);
  return data;
}

export async function logoutApi(): Promise<{ success: true }> {
  const { data } = await http.post<{ success: true }>("/auth/logout");
  return data;
}

export async function meApi<T = unknown>(): Promise<T> {
  const { data } = await http.get<T>("/auth/me");
  return data;
}

/* =========================
   Password flows
========================= */

export async function changePasswordApi(
  input: ChangePasswordInput
): Promise<{ success: true }> {
  const { data } = await http.post<{ success: true }>(
    "/auth/change-password",
    input
  );
  return data;
}

export async function forgotPasswordApi(
  input: ForgotPasswordInput
): Promise<{ success: true }> {
  const { data } = await http.post<{ success: true }>(
    "/auth/forgot-password",
    input
  );
  return data;
}

export async function resetPasswordApi(
  input: ResetPasswordInput
): Promise<{ success: true }> {
  const { data } = await http.post<{ success: true }>(
    "/auth/reset-password",
    input
  );
  return data;
}
