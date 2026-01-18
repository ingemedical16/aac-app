import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("register")
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    const lang =
      (req.headers["accept-language"] as string)?.split(",")[0] || "en";
    return this.authService.register(dto, lang);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto, @Req() req: Request) {
    const lang =
      (req.headers["accept-language"] as string)?.split(",")[0] || "en";
    return this.authService.login(dto, lang);
  }
}
