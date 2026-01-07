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
} from "@nestjs/common";
import { Request } from "express";

import { ProfileService } from "./profile.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfileResponseDto } from "./dto/profile-response.dto";

@Controller("profiles")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private getLang(lang?: string) {
    return lang?.split(",")[0] ?? "en";
  }

  @Post()
  async create(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Body() dto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.create(
      req.user as any,
      dto,
      this.getLang(lang),
    );
    return this.toResponse(profile);
  }

  @Get()
  async findAll(@Req() req: Request): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileService.findAllByUser(req.user as any);
    return profiles.map(this.toResponse);
  }

  @Get(":id")
  async findOne(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.findOne(
      req.user as any,
      id,
      this.getLang(lang),
    );
    return this.toResponse(profile);
  }

  @Patch(":id")
  async update(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await this.profileService.update(
      req.user as any,
      id,
      dto,
      this.getLang(lang),
    );
    return this.toResponse(profile);
  }

  @Delete(":id")
  async deactivate(
    @Req() req: Request,
    @Headers("accept-language") lang: string,
    @Param("id") id: string,
  ) {
    await this.profileService.deactivate(
      req.user as any,
      id,
      this.getLang(lang),
    );
    return { success: true };
  }

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