import { IsString, IsOptional } from 'class-validator';

export class CreateVocabularyDto {
  @IsString()
  word: string;

  @IsString()
  lang: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
