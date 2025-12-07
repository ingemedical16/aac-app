import { IsString, IsOptional } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  lang?: string;
}
