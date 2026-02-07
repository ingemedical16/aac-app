import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthRequest } from "../common/types/auth-request";

type SameSite = "lax" | "strict" | "none";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getLang(req: Request): string {
    const raw = req.headers["accept-language"];
    const header = Array.isArray(raw) ? raw[0] : raw;
    return header?.split(",")[0] || "en";
  }

  /**
   * Cookie settings:
   * - prod/staging cross-site (Vercel -> Railway): SameSite=None; Secure
   * - local dev over http: SameSite=Lax; Secure=false
   *
   * IMPORTANT:
   * - Do NOT set AUTH_COOKIE_DOMAIN for Railway (*.railway.app). Leave it empty.
   * - Only set AUTH_COOKIE_DOMAIN if the API is served on your own domain
   *   (e.g. api-staging.aacboard.work).
   */
  private setAccessCookie(res: Response, token: string) {
    const env = (process.env.NODE_ENV ?? "development").toLowerCase();
    const isProdLike = env === "production" || env === "staging";

    const sameSite = (process.env.AUTH_COOKIE_SAMESITE ??
      (isProdLike ? "none" : "lax")) as SameSite;

    // If SameSite=None, Secure MUST be true (browser requirement)
    const secure =
      process.env.AUTH_COOKIE_SECURE != null
        ? process.env.AUTH_COOKIE_SECURE === "true"
        : sameSite === "none";

    // For Railway, keep this undefined.
    const cookieDomain =
      process.env.AUTH_COOKIE_DOMAIN && process.env.AUTH_COOKIE_DOMAIN.trim().length > 0
        ? process.env.AUTH_COOKIE_DOMAIN.trim()
        : undefined;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure,
      sameSite,
      ...(cookieDomain ? { domain: cookieDomain } : {}),
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAccessCookie(res: Response) {
    const cookieDomain =
      process.env.AUTH_COOKIE_DOMAIN && process.env.AUTH_COOKIE_DOMAIN.trim().length > 0
        ? process.env.AUTH_COOKIE_DOMAIN.trim()
        : undefined;

    res.clearCookie("access_token", {
      path: "/",
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
  }

  @Public()
  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.register(dto, this.getLang(req));
    this.setAccessCookie(res, data.access_token);
    return data; // keep returning token for non-browser clients
  }

  @Public()
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.login(dto, this.getLang(req));
    this.setAccessCookie(res, data.access_token);
    return data;
  }

  @Public()
  @Post("refresh")
  async refresh(
    @Body() dto: RefreshDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const data = await this.authService.refresh(dto, this.getLang(req));
    this.setAccessCookie(res, data.access_token);
    return data;
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAccessCookie(res);
    return { success: true };
  }

  @Post("change-password")
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, dto, this.getLang(req));
  }

  @Public()
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    return this.authService.forgotPassword(dto, this.getLang(req));
  }

  @Public()
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    return this.authService.resetPassword(dto, this.getLang(req));
  }

  @Get("me")
  me(@Req() req: AuthRequest) {
    return req.user;
  }
}
