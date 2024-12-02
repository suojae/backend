import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LogoutResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean; // 로그아웃 성공 여부

  @IsOptional()
  @IsString()
  message?: string; // 추가적인 메시지 (예: "로그아웃이 완료되었습니다.")
}
