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
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { User } from "../entities/user.entity";

@Controller("profiles")
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private getLang(lang?: string) {
    return lang?.split(",")[0] ?? "en";
  }

  /* =========================
     CREATE
  ========================= */
  @Post()
  async create(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Body() dto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    const user = req.user as User;

    const profile = await this.profileService.create(
      user,
      dto,
      this.getLang(lang),
    );

    return this.toResponse(profile);
  }

  /* =========================
     FIND ALL
  ========================= */
  @Get()
  async findAll(
    @Req() req: Request,
  ): Promise<ProfileResponseDto[]> {
    const user = req.user as User;

    const profiles = await this.profileService.findAllByUser(user);

    return profiles.map((p) => this.toResponse(p));
  }

  /* =========================
     FIND ONE
  ========================= */
  @Get(":id")
  async findOne(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
  ): Promise<ProfileResponseDto> {
    const user = req.user as User;

    const profile = await this.profileService.findOne(
      user,
      id,
      this.getLang(lang),
    );

    return this.toResponse(profile);
  }

  /* =========================
     UPDATE
  ========================= */
  @Patch(":id")
  async update(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const user = req.user as User;

    const profile = await this.profileService.update(
      user,
      id,
      dto,
      this.getLang(lang),
    );

    return this.toResponse(profile);
  }

  /* =========================
     DEACTIVATE (SOFT DELETE)
  ========================= */
  @Delete(":id")
  async deactivate(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
  ) {
    const user = req.user as User;

    await this.profileService.deactivate(
      user,
      id,
      this.getLang(lang),
    );

    return { success: true };
  }

  /* =========================
     RESPONSE MAPPER
  ========================= */
  private toResponse(profile: any): ProfileResponseDto {
    return {
      id: profile.id,
      name: profile.name,
      type: profile.type,
      preferredLanguages: profile.preferredLanguages,
      highContrast: profile.highContrast,
      bigButtons: profile.bigButtons,
      childId: profile.child?.id ?? null,
      isActive: profile.isActive,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}