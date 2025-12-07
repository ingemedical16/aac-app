import { IsString, IsOptional } from 'class-validator';

export class UpdateVocabularyDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsString()
  lang?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
