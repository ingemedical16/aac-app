import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { User, Profile } from "../entities";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { AppException } from "../common/exceptions/app-exception";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    ConfigModule,

    PassportModule.register({
      defaultStrategy: "jwt",
    }),

   JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>("JWT_SECRET");

        if (!secret) {
          throw AppException.system("config.jwt_missing");
        }

        return {
          secret,
          signOptions: {
            expiresIn: "7d",
          },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],

  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
