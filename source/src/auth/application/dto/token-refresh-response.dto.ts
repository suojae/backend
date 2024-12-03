import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenRefreshResponseDto {
  @ApiProperty({
    description: '새로운 Access Token',
    example: 'new_access_token_example',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '새로운 Refresh Token (RTR 방식)',
    example: 'new_refresh_token_example',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
