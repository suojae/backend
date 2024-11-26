export interface IExternalAuthService {
  authenticateWithKakao(token: string): Promise<string>;

  authentiacteWithApple(token: string): Promise<string>;

  revokeKakaoUser(accessToken: string): Promise<number>;

  revokeAppleUser(accessToken: string): Promise<string>;
}
