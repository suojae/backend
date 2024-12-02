import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  nickname: string; // 사용자 닉네임

  @IsString()
  @IsNotEmpty()
  characterId: 'rabbit' | 'dog' | 'hamster' | 'cat'; // 선택한 캐릭터

  @IsBoolean()
  @IsNotEmpty()
  termsAgreed: boolean; // 약관 동의 여부
}
