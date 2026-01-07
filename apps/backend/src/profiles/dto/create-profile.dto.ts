import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from "class-validator";
import { ProfileType } from "../../common/enums/profileType.enum";

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ProfileType)
  type: ProfileType;

  /**
   * Required when type === CHILD
   * Must be null/undefined when type === INDIVIDUAL
   * (validated in service layer)
   */
  @IsOptional()
  @IsString()
  childId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  preferredLanguages: string[];

  @IsOptional()
  @IsBoolean()
  highContrast?: boolean;

  @IsOptional()
  @IsBoolean()
  bigButtons?: boolean;
}