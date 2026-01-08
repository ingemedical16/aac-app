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