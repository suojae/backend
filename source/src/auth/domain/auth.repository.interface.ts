
export const IAuthRepository = Symbol('IAuthRepository');

export interface IAuthRepository {
  authenticateKakao(
    userUuid: string,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  authenticateApple(
    userUuid: string,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;

  validateAccessToken(accessToken: string): Promise<any>;

  reissueTokens(
    userUuid: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
}
