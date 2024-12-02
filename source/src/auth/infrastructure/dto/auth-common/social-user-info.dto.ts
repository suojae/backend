import { IsString, IsOptional } from 'class-validator';

export class SocialUserInfoDto {
  @IsOptional()
  @IsString()
  accessToken?: string;

  @IsOptional()
  @IsString()
  idToken?: string;
}
