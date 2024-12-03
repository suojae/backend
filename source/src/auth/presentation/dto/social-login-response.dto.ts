import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginResponseDto {
  @ApiProperty({
    description: '발급된 Access Token',
    example: 'access_token_example',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '발급된 Refresh Token',
    example: 'refresh_token_example',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({
    description: '신규 사용자 여부',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isNewUser: boolean;
}
