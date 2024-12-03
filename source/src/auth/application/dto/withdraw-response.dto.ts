import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawResponseDto {
  @ApiProperty({
    description: '회원탈퇴 성공 여부',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @ApiProperty({
    description: '추가적인 메시지',
    example: '회원탈퇴가 완료되었습니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
