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

import { User, Profile } from "../entities";
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

  async register(dto: RegisterDto, lang = "en") {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) {
      throw new ConflictException(this.i18n.t("auth.user_exists", { lang }));
    }

    if (dto.role === UserRole.ADMIN) {
      throw new BadRequestException(this.i18n.t("auth.roleNotAllowed", { lang }));
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
        user: savedUser, // attach to user (1:1)
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

      // attach the SINGLE profile to user
      savedUser.profile = savedProfile;
      await userRepo.save(savedUser);

      return { user: savedUser, profile: savedProfile };
    });

    return this.sign(result.user, result.profile.id);
  }

  async login(dto: LoginDto, lang = "en") {
    const user = await this.userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: dto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(this.i18n.t("auth.invalid_credentials", { lang }));
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException(this.i18n.t("auth.invalid_credentials", { lang }));
    }

    // get the SINGLE personal profile
    const personalProfile = await this.profileRepo.findOne({
      where: { user: { id: user.id }, isActive: true },
      order: { createdAt: "ASC" },
    });

    return this.sign(user, personalProfile?.id ?? null);
  }

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
