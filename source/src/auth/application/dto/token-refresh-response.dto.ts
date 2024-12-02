import { IsNotEmpty, IsString } from 'class-validator';

export class TokenRefreshResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string; // 새로운 Access Token

  @IsString()
  @IsNotEmpty()
  refreshToken: string; // 새로운 Refresh Token (RTR방식 채택)
}
