import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { AppException } from "../../common/exceptions/app-exception";
import { JwtPayload } from "../../common/types/jwt-payload";
import { AuthRequest } from "../../common/types/auth-request";

type CookieRequest = { cookies: Record<string, unknown> };

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // Allow CORS preflight
    if (request.method === "OPTIONS") return true;

    // Allow @Public() routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Cookie-first: inject cookie token into Authorization header
    const reqWithCookies = request as AuthRequest & Partial<CookieRequest>;
    const raw = reqWithCookies.cookies?.["access_token"];
    const cookieToken = typeof raw === "string" ? raw : undefined;

    if (cookieToken && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${cookieToken}`;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: unknown,
    _info: unknown,
    context: ExecutionContext
  ): TUser {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const langHeader = request.headers["accept-language"] as string | undefined;
    const lang = langHeader?.split(",")[0] || "en";

    if (err || !user) {
      throw AppException.unauthorized("auth.unauthorized", lang);
    }

    return user as TUser;
  }
}
