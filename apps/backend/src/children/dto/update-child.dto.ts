import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateChildDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
