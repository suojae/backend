import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: '로그아웃 성공 여부',
    example: true, // 예시 값
  })
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @ApiProperty({
    description: '추가적인 메시지',
    example: '로그아웃이 완료되었습니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
