import { IsNotEmpty, IsString } from 'class-validator';

export class TokenRefreshRequestDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string; // Refresh Token
}
