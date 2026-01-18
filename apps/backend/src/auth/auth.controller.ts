import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private getLang(req: Request): string {
    return (req.headers["accept-language"] as string)?.split(",")[0] || "en";
  }

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.authService.register(dto, this.getLang(req));
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.authService.login(dto, this.getLang(req));
  }

  @Public()
  @Post("refresh")
  refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.authService.refresh(dto, this.getLang(req));
  }

  @Post("logout")
  logout() {
    // Stateless JWT: logout is handled client-side unless you implement refresh-token revocation.
    return { success: true };
  }

  @Post("change-password")
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const lang =
      (req.headers["accept-language"] as string)?.split(",")[0] || "en";
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
  me(@Req() req: any) {
    return req.user;
  }
}
