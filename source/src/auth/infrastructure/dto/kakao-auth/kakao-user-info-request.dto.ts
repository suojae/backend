import { IsString, IsNotEmpty } from 'class-validator';

export class KakaoUserInfoRequestDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
