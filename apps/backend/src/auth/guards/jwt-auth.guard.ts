import {
  Injectable,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { AppException } from "../../common/exceptions/app-exception";
import { JwtPayload } from "../../common/types/jwt-payload";
import { AuthRequest } from "../../common/types/auth-request";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // Allow CORS preflight
    if (request.method === "OPTIONS") {
      return true;
    }

    // Allow @Public() routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  // Must match Passport's generic signature
  handleRequest<TUser = JwtPayload>(
    err: unknown,
    user: unknown,
    _info: unknown,
    context: ExecutionContext,
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
