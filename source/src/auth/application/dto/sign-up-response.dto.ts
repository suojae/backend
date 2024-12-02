import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpResponseDto {
  @IsString()
  @IsNotEmpty()
  uuid: string; // 사용자 고유 식별자

  @IsString()
  @IsNotEmpty()
  nickname: string; // 사용자 닉네임

  @IsString()
  @IsNotEmpty()
  characterId: 'rabbit' | 'dog' | 'hamster' | 'cat'; // 선택한 캐릭터

  @IsString()
  @IsNotEmpty()
  socialProvider: 'google' | 'kakao' | 'apple'; // 소셜 서비스 제공자
}
