import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequestDto {
  @ApiProperty({
    description: '현재 Access Token',
    example: 'access_token_example', // 예시 값
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '현재 Refresh Token',
    example: 'refresh_token_example', // 예시 값
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
