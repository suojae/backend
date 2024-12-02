import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WithdrawResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  success: boolean; // 회원탈퇴 성공 여부

  @IsOptional()
  @IsString()
  message?: string; // 추가적인 메시지 (예: "회원탈퇴가 완료되었습니다.")
}
