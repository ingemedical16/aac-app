import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "auth.email_invalid" })
  email: string;

  @IsString({ message: "auth.password_invalid" })
  @MinLength(8, { message: "auth.password_too_short" })
  password: string;
}
