import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateResponseDto {
  @ApiProperty({
    description: '수정 성공 여부',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: '업데이트된 닉네임',
    example: 'new_nickname123',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({
    description: '업데이트된 캐릭터 ID',
    example: 'hamster',
    required: false,
  })
  @IsOptional()
  @IsString()
  characterId?: string;

  @ApiProperty({
    description: '업데이트된 동의 약관 여부',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  termsAgreed?: boolean;

  @ApiProperty({
    description: '추가 메시지',
    example: '유저정보가 성공적으로 수정되었습니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;
}
