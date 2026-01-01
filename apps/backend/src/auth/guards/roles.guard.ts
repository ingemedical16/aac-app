import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { I18nService } from "nestjs-i18n";
import { UserRole } from "../roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1️⃣ Read roles metadata from handler or controller
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      "roles",
      [context.getHandler(), context.getClass()],
    );

    // If no roles defined → allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 2️⃣ Extract authenticated user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Safety check
    if (!user || !user.role) {
      throw new ForbiddenException(
        this.i18n.t("auth.forbidden", { lang: request.i18nLang }),
      );
    }

    // 3️⃣ Role match
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        this.i18n.t("auth.forbidden", { lang: request.i18nLang }),
      );
    }

    return true;
  }
}
