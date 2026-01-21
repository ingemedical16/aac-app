/**
 * Standard JWT payload used across the application.
 * This represents the data embedded in access and refresh tokens.
 */
export interface JwtPayload {
  /**
   * Subject — user id
   */
  sub: string;

  /**
   * User email (optional)
   */
  email?: string;

  /**
   * User role (optional)
   */
  role?: string;

  /**
   * Active profile id (optional)
   */
  profileId?: string | null;

  /**
   * Issued at (JWT standard)
   */
  iat?: number;

  /**
   * Expiration timestamp (JWT standard)
   */
  exp?: number;
}
