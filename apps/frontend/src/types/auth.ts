export type UserRole = "ADMIN" | "PROFESSIONAL" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  profileId?: string | null;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  profileId?: string | null;
  exp?: number;
  iat?: number;
}

/* =========================
   API INPUT TYPES
========================= */

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
};

export type RefreshInput = {
  refresh_token: string;
};

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  newPassword: string;
};

export type AuthResponse = {
  access_token: string;
};
