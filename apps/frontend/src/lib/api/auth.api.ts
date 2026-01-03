// src/lib/api/auth.api.ts
import { http } from "./http";

export type LoginInput = { email: string; password: string };
export type RegisterInput = {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
};

export type AuthResponse = { access_token: string };

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/login", input);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>("/auth/register", input);
  return data;
}
