import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../common/enums/roles.enum";
import { AppException } from "../../common/exceptions/app-exception";
import type { AuthRequest } from "../../common/types/auth-request";

function getLang(req: Request): string {
  const raw = req.headers["accept-language"];
  const header = Array.isArray(raw) ? raw[0] : raw;
  return header?.split(",")[0] || "en";
}

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && (Object.values(UserRole) as string[]).includes(value);
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 🔓 No role restriction
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const lang = getLang(request);

    const user = request.user;

    // 🚫 No authenticated user / missing role
    if (!user || !isUserRole(user.role)) {
      throw AppException.forbidden("auth.access_denied", lang);
    }

    // 🚫 Role mismatch
    if (!requiredRoles.includes(user.role)) {
      throw AppException.forbidden("auth.insufficient_role", lang, {
        role: user.role,
        required: requiredRoles.join(", "),
      });
    }

    return true;
  }
}
