import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User, Profile } from "../entities";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

import { UserRole } from "../common/enums/roles.enum";
import { ProfileType } from "../common/enums/profileType.enum";
import { AppException } from "../common/exceptions/app-exception";
import { JwtPayload } from "../common/types/jwt-payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  /* =========================
     REGISTER
  ========================= */
  async register(dto: RegisterDto, lang = "en") {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw AppException.conflict("auth.user_exists", lang);
    }

    if (dto.role === UserRole.ADMIN) {
      throw AppException.badRequest("auth.roleNotAllowed", lang);
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const role = dto.role || UserRole.USER;
    const primaryLanguage = (lang?.split(",")?.[0] ?? "en").trim() || "en";

    const result = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const profileRepo = manager.getRepository(Profile);

      const user = userRepo.create({
        email: dto.email,
        password: hash,
        role,
      });

      const savedUser = await userRepo.save(user);

      const displayName =
        [dto.firstName, dto.lastName].filter(Boolean).join(" ").trim() ||
        dto.email.split("@")[0];

      const profile = profileRepo.create({
        owner: savedUser,
        user: savedUser,
        displayName,
        type: ProfileType.INDIVIDUAL,

        firstName: dto.firstName ?? null,
        lastName: dto.lastName ?? null,
        dateOfBirth: null,
        sex: null,
        avatarUrl: null,

        isPatient: role === UserRole.USER,
        primaryLanguage,
        preferredLanguages: [primaryLanguage],
      });

      const savedProfile = await profileRepo.save(profile);

      savedUser.profile = savedProfile;
      await userRepo.save(savedUser);

      return { user: savedUser, profile: savedProfile };
    });

    return this.sign(result.user, result.profile.id);
  }

  /* =========================
     LOGIN
  ========================= */
  async login(dto: LoginDto, lang = "en") {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: dto.email })
      .getOne();

    if (!user) {
      throw AppException.unauthorized("auth.invalid_credentials", lang);
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw AppException.unauthorized("auth.invalid_credentials", lang);
    }

    const personalProfile = await this.profileRepo.findOne({
      where: { user: { id: user.id }, isActive: true },
      order: { createdAt: "ASC" },
    });

    return this.sign(user, personalProfile?.id ?? null);
  }

  /* =========================
     REFRESH TOKEN
  ========================= */
  async refresh(dto: RefreshDto, lang = "en") {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(dto.refresh_token);
    } catch {
      throw AppException.unauthorized("auth.invalid_token", lang);
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw AppException.unauthorized("auth.invalid_token", lang);
    }

    return this.sign(user, payload.profileId ?? null);
  }

  /* =========================
     CHANGE PASSWORD
  ========================= */
  async changePassword(userId: string, dto: ChangePasswordDto, lang = "en") {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!user) {
      throw AppException.unauthorized("auth.invalid_credentials", lang);
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw AppException.unauthorized("auth.invalid_credentials", lang);
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { success: true };
  }

  /* =========================
     FORGOT PASSWORD
  ========================= */
  async forgotPassword(dto: ForgotPasswordDto, lang = "en") {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    // Prevent account enumeration
    if (!user) return { success: true };

    const token = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: "15m" }
    );

    // TODO: send email
    console.log("RESET TOKEN:", token, "lang:", lang);

    return { success: true };
  }

  /* =========================
     RESET PASSWORD
  ========================= */
  async resetPassword(dto: ResetPasswordDto, lang = "en") {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(dto.token);
    } catch {
      throw AppException.unauthorized("auth.invalid_token", lang);
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw AppException.unauthorized("auth.invalid_token", lang);
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { success: true };
  }

  /* =========================
     JWT SIGN
  ========================= */
  private sign(user: User, profileId: string | null) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        profileId,
      }),
    };
  }
}
