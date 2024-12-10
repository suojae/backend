import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignOutRequestDto {
  @ApiProperty({
    description: '현재 Refresh Token',
    example: 'refresh_token_example',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
