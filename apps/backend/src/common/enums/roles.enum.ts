// src/auth/roles.enum.ts

/**
 * System user roles (RBAC)
 *
 * - Stored in DB as strings
 * - Embedded in JWT payload
 * - NEVER localized
 * - Stable across backend & frontend
 */

export enum UserRole {
  ADMIN = "ADMIN",
  PROFESSIONAL = "PROFESSIONAL",
  PATIENT = "PATIENT",
}
