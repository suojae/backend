import { IsNotEmpty, IsString, IsBoolean, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SignUpRequestDto {
  @ApiProperty({
    description: '사용자 닉네임',
    example: 'rabbit123',
  })
  @IsNotEmpty({ message: '닉네임은 필수 입력 값입니다.' })
  @Length(1, 10, { message: '닉네임은 1자 이상, 10자 이하로 입력해야 합니다.' })
  nickname: string;

  @ApiProperty({
    description: '선택한 캐릭터',
    example: 'rabbit',
  })
  @IsString()
  @IsNotEmpty()
  characterId: 'rabbit' | 'dog' | 'hamster' | 'cat';

  @ApiProperty({
    description: '약관 동의 여부',
    example: true,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsNotEmpty()
  termsAgreed: boolean;

  @ApiProperty({
    description: '소셜 서비스 제공자',
    example: 'kakao',
  })
  @IsString()
  @IsNotEmpty()
  socialProvider: 'kakao' | 'apple';

  @ApiProperty({
    description: '소셜 로그인 인증 코드',
    example: 'auth_code_example',
  })
  @IsString()
  @IsNotEmpty()
  authCode: string;
}
