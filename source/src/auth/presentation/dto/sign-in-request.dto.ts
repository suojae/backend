import {IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({
    description: '이전에 발급된 Access Token',
    example: 'access_token',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({
    description: '이전에 발급된 refresh token',
    example: 'refresh_token_example',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
