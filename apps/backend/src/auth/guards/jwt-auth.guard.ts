import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly i18n: I18nService) {
    super();
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    const lang = request.headers["accept-language"] || "en";

    if (err || !user) {
      throw new UnauthorizedException(
        this.i18n.t("auth.unauthorized", { lang }),
      );
    }

    return user;
  }
}