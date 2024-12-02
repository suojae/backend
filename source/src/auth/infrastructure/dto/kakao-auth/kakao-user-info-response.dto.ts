import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class KakaoAccountDto {
  @IsOptional()
  @IsString()
  email?: string;
}

export class KakaoUserInfoResponseDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => KakaoAccountDto)
  kakao_account?: KakaoAccountDto;
}
