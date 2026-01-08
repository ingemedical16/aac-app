import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../../common/enums/roles.enum";

export class RegisterDto {
  @IsEmail({}, { message: "auth.email_invalid" })
  email: string;

  @IsString({ message: "auth.password_invalid" })
  @MinLength(8, { message: "auth.password_too_short" })
  password: string;

  /**
   * Optional role at registration
   * Allowed: USER, PROFESSIONAL
   * Forbidden: ADMIN (enforced again in service)
   */
  @IsOptional()
  @IsEnum([UserRole.USER, UserRole.PROFESSIONAL], {
    message: "auth.role_not_allowed",
  })
  role?: UserRole;

  /**
   * Optional identity fields
   * Used to generate default INDIVIDUAL profile
   */
  @IsOptional()
  @IsString({ message: "auth.first_name_invalid" })
  firstName?: string;

  @IsOptional()
  @IsString({ message: "auth.last_name_invalid" })
  lastName?: string;
}
