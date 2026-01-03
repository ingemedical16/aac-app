// src/types/auth.ts

export type UserRole =
  | "ADMIN"
  | "PROFESSIONAL"
  | "PARENT"
  | "PATIENT_ADULT"
  | "CHILD";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp?: number;
  iat?: number;
}
