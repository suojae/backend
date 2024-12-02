import { IsNotEmpty, IsString, IsBoolean, Length } from "class-validator";
import { Transform } from 'class-transformer';

export class SignUpRequestDto {

  @IsNotEmpty({ message: '닉네임은 필수 입력 값입니다.' })
  @Length(1, 10, { message: '닉네임은 1자 이상, 10자 이하로 입력해야 합니다.' })
  nickname: string; // 사용자 닉네임

  @IsString()
  @IsNotEmpty()
  characterId: 'rabbit' | 'dog' | 'hamster' | 'cat'; // 선택한 캐릭터

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsNotEmpty()
  termsAgreed: boolean; // 약관 동의 여부

  @IsString()
  @IsNotEmpty()
  socialProvider: 'kakao' | 'apple'; // 소셜 서비스 제공자

  @IsString()
  @IsNotEmpty()
  authCode: string; // 소셜 로그인 인증 코드
}
