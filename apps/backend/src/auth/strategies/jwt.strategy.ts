import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

import { AppException } from "../../common/exceptions/app-exception";
import { JwtPayload } from "../../common/types/jwt-payload";

export interface JwtValidatedUser {
  id: string;
  email?: string;
  role?: string;
  profileId?: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_SECRET");

    if (!secret) {
      throw AppException.system("config.jwt_missing");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<JwtValidatedUser> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      profileId: payload.profileId ?? null,
    };
  }
}
