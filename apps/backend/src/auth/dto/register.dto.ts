import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../../common/enums/roles.enum";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  /**
   * Optional role at registration
   * Allowed: USER, PROFESSIONAL
   * Forbidden: ADMIN (enforced in service)
   */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /**
   * Optional identity fields
   * Used to generate default INDIVIDUAL profile
   */
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
