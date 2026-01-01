import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { I18nService } from "nestjs-i18n";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    // 🔓 No role restriction
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 🌍 Detect language (fallback = en)
    const lang =
      request.headers["accept-language"]?.split(",")[0] ?? "en";

    // 🚫 No authenticated user
    if (!user || !user.role) {
      throw new ForbiddenException(
        this.i18n.t("auth.access_denied", { lang })
      );
    }

    // 🚫 Role mismatch
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        this.i18n.t("auth.insufficient_role", {
          lang,
          args: {
            role: user.role,
            required: requiredRoles.join(", "),
          },
        })
      );
    }

    return true;
  }
}
