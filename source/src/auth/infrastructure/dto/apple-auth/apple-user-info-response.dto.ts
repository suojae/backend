import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class AppleUserInfoResponseDto {
  @IsString()
  iss: string;

  @IsString()
  aud: string;

  @IsNumber()
  exp: number;

  @IsNumber()
  iat: number;

  @IsString()
  sub: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsBoolean()
  email_verified?: boolean;

  @IsOptional()
  @IsBoolean()
  is_private_email?: boolean;

  @IsOptional()
  @IsNumber()
  auth_time?: number;

  @IsOptional()
  @IsBoolean()
  nonce_supported?: boolean;
}
