import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { User } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    // ✅ makes ConfigService available here (even if global)
    ConfigModule,

    PassportModule.register({
      defaultStrategy: "jwt",
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET") || "dev-secret-change-me",
        signOptions: {
          expiresIn: "7d",
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,

    /* =========================
       GLOBAL SECURITY GUARDS
    ========================= */
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
