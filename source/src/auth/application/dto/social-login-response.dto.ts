import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string; // 발급된 Access Token

  @IsString()
  @IsNotEmpty()
  refreshToken: string; // 발급된 Refresh Token

  @IsBoolean()
  @IsNotEmpty()
  isNewUser: boolean; // 신규 사용자 여부
}
