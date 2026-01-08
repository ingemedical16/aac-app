import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { I18nService } from "nestjs-i18n";

import { User } from "../users/user.entity";
import { Profile } from "../profiles/profile.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "../common/enums/roles.enum";
import { ProfileType } from "../common/enums/profileType.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService
  ) {}

  /* =========================
     REGISTER
  ========================= */
  async register(dto: RegisterDto, lang = "en") {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (exists) {
      throw new ConflictException(
        this.i18n.t("auth.user_exists", { lang })
      );
    }

    if (dto.role === UserRole.ADMIN) {
      const errorMessage = this.i18n.t("auth.role_not_allowed", { lang })
  throw new BadRequestException(errorMessage);
}


    const hash = await bcrypt.hash(dto.password, 10);



    const primaryLanguage = (lang?.split(",")?.[0] ?? "en").trim() || "en";

    const result = await this.dataSource.transaction(async (manager) => {
      const user = manager.getRepository(User).create({
        email: dto.email,
        password: hash,
        role,
      });

      const savedUser = await manager.getRepository(User).save(user);

      // ✅ Create INDIVIDUAL profile for EVERY non-admin user
      const isPatient = role === UserRole.USER; // professionals/admins default false
      const displayName =
        [dto.firstName, dto.lastName].filter(Boolean).join(" ").trim() ||
        dto.email.split("@")[0];

      const profile = manager.getRepository(Profile).create({
        owner: savedUser,
        child: null,
        name: displayName,
        type: ProfileType.INDIVIDUAL,

        firstName: dto.firstName ?? null,
        lastName: dto.lastName ?? null,

        // identity fields optional at registration
        dateOfBirth: null,
        sex: null,
        avatarUrl: null,

        isPatient,
        primaryLanguage,
        preferredLanguages: [primaryLanguage],
        highContrast: false,
        bigButtons: false,
      });

      const savedProfile = await manager.getRepository(Profile).save(profile);

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
      throw new UnauthorizedException(
        this.i18n.t("auth.invalid_credentials", { lang })
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException(
        this.i18n.t("auth.invalid_credentials", { lang })
      );
    }

    // Optional: include default profile id if you want
    const firstProfile = await this.profileRepo.findOne({
      where: { owner: { id: user.id }, isActive: true },
      order: { createdAt: "ASC" },
    });

    return this.sign(user, firstProfile?.id ?? null);
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
        profileId, // ✅ helps frontend (optional but useful)
      }),
    };
  }
}