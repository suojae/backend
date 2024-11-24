import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(8, { message: 'password 는 최소 8자 이상이여야만 합니다.'})
  readonly password: string;
}
