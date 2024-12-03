import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginRequestDto {
  @ApiProperty({
    description: '소셜 서비스 제공자',
    example: 'kakao',
  })
  @IsString()
  @IsNotEmpty()
  socialProvider: 'google' | 'kakao' | 'apple';

  @ApiProperty({
    description: '소셜 로그인 인증 코드',
    example: 'auth_code_example',
  })
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
