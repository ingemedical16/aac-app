import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

/**
 * Centralized application exception factory
 * All errors must go through this class
 */
export class AppException {
  private static i18n: I18nService;

  /** Inject I18nService once at app bootstrap */
  static init(i18n: I18nService) {
    this.i18n = i18n;
  }

  private static t(key: string, lang = "en", args?: Record<string, any>) {
    if (!this.i18n) {
      return key; // fallback if not initialized
    }

    return this.i18n.t(key, { lang, args });
  }

  static badRequest(key: string, lang = "en", args?: Record<string, any>) {
    return new BadRequestException(this.t(key, lang, args));
  }

  static unauthorized(key: string, lang = "en", args?: Record<string, any>) {
    return new UnauthorizedException(this.t(key, lang, args));
  }

  static forbidden(key: string, lang = "en", args?: Record<string, any>) {
    return new ForbiddenException(this.t(key, lang, args));
  }

  static notFound(key: string, lang = "en", args?: Record<string, any>) {
    return new NotFoundException(this.t(key, lang, args));
  }

  static conflict(key: string, lang = "en", args?: Record<string, any>) {
    return new ConflictException(this.t(key, lang, args));
  }

  static system(key: string, lang = "en") {
    return new InternalServerErrorException(this.t(key, lang));
  }
}
