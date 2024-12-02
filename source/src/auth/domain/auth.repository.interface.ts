import { SocialProvider } from './social-provider.type';

export interface IAuthRepository {
  /**
   * 소셜 인증을 통해 신규 사용자를 생성
   */
  registerUser(
    socialProvider: SocialProvider,
    authCode: string,
  ): Promise<string>;

  /**
   * 소셜 인증 및 백엔드 토큰 발급
   */
  authenticateSocial(
    userUuid: string,
    socialProvider: SocialProvider,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  /**
   * Access Token 검증
   */
  validateAccessToken(accessToken: string): Promise<any>;

  /**
   * 토큰 재발급
   */
  reissueTokens(
    userUuid: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  /**
   * 로그아웃 처리 (Access Token 블랙리스트 추가 및 Refresh Token 삭제)
   */
  logout(
    userUuid: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void>;

  /**
   * 회원탈퇴 처리
   * - MySQL 데이터 삭제
   * - Redis 캐시 삭제
   * - 외부 소셜 서비스 연결 끊기
   */
  withdraw(userUuid: string, socialProvider: SocialProvider): Promise<void>;
}
