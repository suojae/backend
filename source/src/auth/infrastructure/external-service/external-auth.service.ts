import { Injectable } from '@nestjs/common';
import { IExternalAuthService } from '../../domain/external-auth.service.interface';
import { AppleAuthService } from './apple-auth.service';
import { KakaoAuthService } from './kakao-auth.service';

@Injectable()
export class ExternalAuthService implements IExternalAuthService {
  constructor(
    private readonly appleAuthService: AppleAuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  /**
   * Apple 인증
   * - Authorization Code를 사용하여 Apple의 Access Token을 가져옵니다.
   * @param authCode Apple 인증에서 제공받은 Authorization Code
   * @returns Access Token (Promise<string>)
   */
  authentiacteWithApple(authCode: string): Promise<string> {
    return this.appleAuthService.getAccessToken(authCode);
  }

  /**
   * Kakao 인증
   * Authorization Code를 사용하여 Kakao의 Access Token을 가져옵니다
   * @param authCode Kakao 인증에서 제공받은 Authorization Code
   * @returns Access Token (Promise<string>)
   */
  authenticateWithKakao(authCode: string): Promise<string> {
    return this.kakaoAuthService.getAccessToken(authCode);
  }

  /**
   * Apple 사용자 회원탈퇴
   * Apple 서버로 Access Token을 사용하여 회원탈퇴 요청을 보냅니다
   * @param accessToken Apple에서 발급받은 Access Token
   * @returns 성공 메시지 (Promise<string>)
   */
  revokeAppleUser(accessToken: string): Promise<string> {
    return this.appleAuthService.revokeAccessToken(accessToken);
  }

  /**
   * Kakao 사용자 회원탈퇴
   * Kakao 서버로 Access Token을 사용하여 회원탈퇴 요청을 보냅니다
   * @param accessToken Kakao에서 발급받은 Access Token
   * @returns 회원탈퇴한 사용자 ID (Promise<number>)
   */
  revockeKakaoUser(accessToken: string): Promise<number> {
    return this.kakaoAuthService.unlinkUser(accessToken);
  }
}
