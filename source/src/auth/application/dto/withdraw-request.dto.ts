import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawRequestDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string; // 현재 Access Token

  @IsString()
  @IsNotEmpty()
  refreshToken: string; // 현재 Refresh Token
}