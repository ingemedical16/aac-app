import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private i18n: I18nService,
  ) {}

  async register(dto: RegisterDto, lang = 'en') {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });

    if (exists) {
      throw new ConflictException(this.i18n.t('auth.user_exists', { lang }));
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hash,
    });

    await this.userRepo.save(user);

    return this.sign(user);
  }

  async login(dto: LoginDto, lang = 'en') {
    const user = await this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password') // 👈 explicitly load password only for login
            .where('user.email = :email', { email: dto.email })
            .getOne();


    if (!user) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_credentials', { lang }),
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException(
        this.i18n.t('auth.invalid_credentials', { lang }),
      );
    }

    return this.sign(user);
  }

  sign(user: User) {
    return {
      access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
    };
  }
}
