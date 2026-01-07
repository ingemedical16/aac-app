import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { UserRole } from "../../common/enums/roles.enum";

/**
 * Registration DTO
 * Controls which roles can be assigned at signup
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  /**
   * Optional role:
   * - Allowed: PARENT, PROFESSIONAL, PATIENT_ADULT
   * - Forbidden at registration: ADMIN
   */
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /* =========================
     Optional profile info
  ========================= */

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
