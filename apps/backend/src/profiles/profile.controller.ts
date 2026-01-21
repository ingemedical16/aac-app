import {
  Controller,
  UseGuards,
} from "@nestjs/common";

import { ProfileService } from "./profile.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("profiles")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private getLang(lang?: string) {
    return lang?.split(",")[0] ?? "en";
  }

}