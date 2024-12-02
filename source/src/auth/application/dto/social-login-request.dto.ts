import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  socialProvider: 'google' | 'kakao' | 'apple'; // 소셜 서비스 제공자

  @IsString()
  @IsNotEmpty()
  authCode: string; // 소셜 로그인 인증 코드

  @IsOptional()
  @IsString()
  idToken?: string; // Apple 로그인 시 사용하는 ID Token
}
