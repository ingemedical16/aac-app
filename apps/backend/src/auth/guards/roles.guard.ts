import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../../common/enums/roles.enum";
import { AppException } from "../../common/exceptions/app-exception";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 🔓 No role restriction
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🌍 Detect language (fallback = en)
    const langHeader = request.headers["accept-language"] as string;
    const lang = langHeader?.split(",")[0] || "en";

    // 🚫 No authenticated user
    if (!user || !user.role) {
      throw AppException.forbidden("auth.access_denied", lang);
    }

    // 🚫 Role mismatch
    const userRole = user.role as UserRole;

    if (!requiredRoles.includes(userRole)) {
      throw AppException.forbidden("auth.insufficient_role", lang, {
        role: userRole,
        required: requiredRoles.join(", "),
      });
    }

    return true;
  }
}
