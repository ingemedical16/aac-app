import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Headers,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";

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