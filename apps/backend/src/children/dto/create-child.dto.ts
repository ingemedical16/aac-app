import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateChildDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
