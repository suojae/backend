import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class SocialTokenResponseDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsOptional()
  @IsString()
  idToken?: string;
}
