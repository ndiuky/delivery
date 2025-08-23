import { IsEmail, IsJWT, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 25)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @Length(3, 20)
  firstName: string;

  @IsString()
  @Length(3, 20)
  lastName: string;

  @IsString()
  @Length(5, 15)
  nickname: string;
}

export class UpdateTokenDto {
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
