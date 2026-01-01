import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../roles.enum";

/**
 * Roles decorator
 *
 * Usage:
 * @Roles(UserRole.ADMIN)
 * @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL)
 *
 * Read by RolesGuard via Reflector
 */
export const ROLES_KEY = "roles";

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
