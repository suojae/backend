import { IsString, IsNotEmpty } from 'class-validator';

export class SocialAuthCodeDto {
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
