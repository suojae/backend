import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    description: '사용자 고유 식별자',
    example: 'uuid_12345',
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({
    description: '사용자 닉네임',
    example: 'rabbit123',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    description: '선택한 캐릭터',
    example: 'rabbit',
  })
  @IsString()
  @IsNotEmpty()
  characterId: 'rabbit' | 'dog' | 'hamster' | 'cat';

  @ApiProperty({
    description: '소셜 서비스 제공자',
    example: 'kakao',
  })
  @IsString()
  @IsNotEmpty()
  socialProvider: 'google' | 'kakao' | 'apple';
}
