import {
  Injectable,
  ExecutionContext,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { AppException } from "../../common/exceptions/app-exception";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // ✅ Always allow CORS preflight
    if (request.method === "OPTIONS") {
      return true;
    }

    // ✅ Allow @Public() routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const langHeader = request.headers["accept-language"] as string;
    const lang = langHeader?.split(",")[0] || "en";

    if (err || !user) {
      throw AppException.unauthorized("auth.unauthorized", lang);
    }

    return user;
  }
}
