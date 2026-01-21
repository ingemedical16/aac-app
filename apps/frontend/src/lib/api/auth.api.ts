import { http } from "./http";
import type {
  LoginInput,
  RegisterInput,
  RefreshInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AuthResponse,
} from "@/types/auth";

/* =========================
   AUTH API
========================= */

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/register", input);
  return data;
}

export async function refreshApi(input: RefreshInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/refresh", input);
  return data;
}

export async function logoutApi() {
  const { data } = await http.post("/auth/logout");
  return data;
}

export async function changePasswordApi(input: ChangePasswordInput) {
  const { data } = await http.post("/auth/change-password", input);
  return data;
}

export async function forgotPasswordApi(input: ForgotPasswordInput) {
  const { data } = await http.post("/auth/forgot-password", input);
  return data;
}

export async function resetPasswordApi(input: ResetPasswordInput) {
  const { data } = await http.post("/auth/reset-password", input);
  return data;
}

export async function meApi() {
  const { data } = await http.get("/auth/me");
  return data;
}
