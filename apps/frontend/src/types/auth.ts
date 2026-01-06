// src/types/auth.ts

/**
 * 🔐 AUTH ROLES (server-driven)
 * Used ONLY for routing & access control
 */
export type UserRole =
  | "ADMIN"
  | "PROFESSIONAL"
  | "PATIENT";

/**
 * 👤 Authenticated user (derived from JWT)
 * This is NOT a profile and NOT a board configuration
 */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;

  /**
   * Optional claims injected by backend
   * Used by frontend to decide:
   * - dashboard vs board
   * - child selector vs direct board
   */
  isPatient?: boolean;
  children?: string[]; // child IDs
}

/**
 * 🔑 JWT payload shape
 * Must stay in sync with backend `sign()` method
 */
export interface JwtPayload {
  sub: string;        // user id
  email: string;
  role: UserRole;

  // Optional domain claims
  isPatient?: boolean;
  children?: string[];

  // JWT standard
  exp?: number;
  iat?: number;
}