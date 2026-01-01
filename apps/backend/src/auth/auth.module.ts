import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";

import { User } from "../users/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || "dev-secret-change-me",
      signOptions: {
        expiresIn: "7d",
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,

    /* =========================
       GLOBAL SECURITY GUARDS
    ========================= */

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 🔐 JWT required everywhere
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // 🛡️ Role-based access control
    },
  ],

  exports: [AuthService],
})
export class AuthModule {}