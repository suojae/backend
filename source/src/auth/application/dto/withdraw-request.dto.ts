import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawRequestDto {
  @ApiProperty({
    description: '현재 Access Token',
    example: 'access_token_example',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
