import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ProfileType } from "../../common/enums/profileType.enum";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProfileType)
  type: ProfileType;

  /**
   * Required for CHILD profiles
   * Optional for INDIVIDUAL
   */
  @IsOptional()
  @IsString()
  childId?: string;

  @IsArray()
  @IsString({ each: true })
  preferredLanguages: string[];

  @IsOptional()
  @IsBoolean()
  highContrast?: boolean;

  @IsOptional()
  @IsBoolean()
  bigButtons?: boolean;
}