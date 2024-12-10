import {IsBoolean, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    description: '사용자 고유 식별자',
    example: 'uuid_12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  uuid?: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: 'rabbit123',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '선택한 캐릭터',
    example: 'rabbit',
    required: false,
  })
  @IsOptional()
  @IsString()
  themeAnimal?: string;

  @ApiProperty({
    description: '동의 약관 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  termsAgreed?: boolean;

  @ApiProperty({
    description: '소셜 서비스 제공자',
    example: 'kakao',
  })
  @IsString()
  @IsNotEmpty()
  socialProvider: string;

  @ApiProperty({
    description: 'Access Token',
    example: 'access_token_example',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
    example: 'refresh_token_example',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
