import { IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  socialProvider: 'google' | 'kakao' | 'apple'; // 소셜 서비스 제공자

  @IsString()
  @IsNotEmpty()
  authCode: string; // 소셜 로그인 인증 코드
}
