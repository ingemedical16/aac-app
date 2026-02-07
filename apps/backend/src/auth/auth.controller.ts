import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { AuthRequest } from "../common/types/auth-request";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getLang(req: Request): string {
    return (req.headers["accept-language"] as string)?.split(",")[0] || "en";
  }

  /**
   * Cookie settings:
   * - prod/staging cross-site: SameSite=None; Secure
   * - local dev: SameSite=Lax; Secure=false (cookies over http)
   */
  private setAccessCookie(res: Response, token: string) {
    const isProd = (process.env.NODE_ENV ?? "development") === "production";
    const sameSite = (process.env.AUTH_COOKIE_SAMESITE ??
      (isProd ? "none" : "lax")) as "lax" | "strict" | "none";

    // If SameSite=None, Secure MUST be true (browser requirement)
    const secure =
      (process.env.AUTH_COOKIE_SECURE
        ? process.env.AUTH_COOKIE_SECURE === "true"
        : sameSite === "none");

    const domain = process.env.AUTH_COOKIE_DOMAIN || undefined; // e.g. ".aacboard.work"

    res.cookie("access_token", token, {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAccessCookie(res: Response) {
    const domain = process.env.AUTH_COOKIE_DOMAIN || undefined;
    res.clearCookie("access_token", { path: "/", domain });
  }

  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.register(dto, this.getLang(req));
    this.setAccessCookie(res, data.access_token);
    return data; // keep returning token for non-browser clients
  }

  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(dto, this.getLang(req));
    this.setAccessCookie(res, data.access_token);
    return data;
  }

  @Public()
  @Post("refresh")
  async refresh(@Body() dto: RefreshDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
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
    const lang = (req.headers["accept-language"] as string)?.split(",")[0] || "en";
    return this.authService.changePassword(req.user.id, dto, lang);
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
