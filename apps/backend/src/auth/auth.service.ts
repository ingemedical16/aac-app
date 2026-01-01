import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { I18nService } from "nestjs-i18n";

import { User } from "../users/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "./roles.enum";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

    const hash = await bcrypt.hash(dto.password, 10);

    const role =
      dto.role && dto.role !== UserRole.ADMIN
        ? dto.role
        : UserRole.PARENT;

    const user = this.userRepo.create({
      email: dto.email,
      password: hash,
      role,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.userRepo.save(user);

    return this.sign(user);
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

    return this.sign(user);
  }

  /* =========================
     JWT SIGN
  ========================= */
  private sign(user: User) {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role, // ✅ REQUIRED FOR RBAC
      }),
    };
  }
}
