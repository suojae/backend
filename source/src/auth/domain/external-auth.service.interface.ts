export interface IExternalAuthService {
  authenticateWithKakao(token: string): Promise<boolean>;
  authentiacteWithApple(token: string): Promise<boolean>;
}

