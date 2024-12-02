import { IsString, IsNumber, IsOptional } from 'class-validator';

export class SocialRevokeResponseDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}
