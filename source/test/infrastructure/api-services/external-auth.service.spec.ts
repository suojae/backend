import { ExternalAuthService } from '../../../src/auth/infrastructure/api-services/external-auth.service';
import { AppleAuthService } from '../../../src/auth/infrastructure/api-services/apple-auth.service';
import { KakaoAuthService } from '../../../src/auth/infrastructure/api-services/kakao-auth.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('External AuthService', () => {
  let service: ExternalAuthService;
  let appleAuthService: AppleAuthService;
  let kakaoAuthService: KakaoAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExternalAuthService,
        {
          provide: AppleAuthService,
          useValue: {
            getAccessToken: jest.fn(),
            revokeAccessToken: jest.fn(),
          },
        },
        {
          provide: KakaoAuthService,
          useValue: {
            getAccessToken: jest.fn(),
            unlinkUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExternalAuthService>(ExternalAuthService);
    appleAuthService = module.get<AppleAuthService>(AppleAuthService);
    kakaoAuthService = module.get<KakaoAuthService>(KakaoAuthService);
  });

  describe('authentiacteWithApple', () => {
    it('Apple 인증코드가 주어졌을 때, 인증요청을 하면, AccessToken을 반환한다', async () => {
      // Given
      const authCode = 'apple-auth-code';
      const accessToken = 'apple-access_token';
      jest
        .spyOn(appleAuthService, 'getAccessToken')
        .mockResolvedValue(accessToken);

      // When
      const result = await service.authentiacteWithApple(authCode);

      // Then
      expect(result).toBe(accessToken);
      expect(appleAuthService.getAccessToken).toHaveBeenCalledWith(authCode);
    });
  });

  describe('authenticateWithKakao', () => {
    it('Kakao 인증코드가 주어졌을 때, 인증요청을 하면, AccessToken을 반환한다', async () => {
      // Given
      const authCode = 'kakao-auth-code';
      const accessToken = 'kakao-access-token';
      jest
        .spyOn(kakaoAuthService, 'getAccessToken')
        .mockResolvedValue(accessToken);

      // When
      const result = await service.authenticateWithKakao(authCode);

      // Then
      expect(result).toBe(accessToken);
      expect(kakaoAuthService.getAccessToken).toHaveBeenCalledWith(authCode);
    });
  });

  describe('revokeAppleUser', () => {
    it('Apple Access Token이 주어졌을 때, 회원탈퇴 요청을 하면, 성공메세지를 반환한다', async () => {
      // Given
      const accessToken = 'apple-access-token';
      const successMessage = '탈퇴 성공';
      jest
        .spyOn(appleAuthService, 'revokeAccessToken')
        .mockResolvedValue(successMessage);

      // When
      const result = await service.revokeAppleUser(accessToken);

      // Then
      expect(result).toBe(successMessage);
      expect(appleAuthService.revokeAccessToken).toHaveBeenCalledWith(
        accessToken,
      );
    });
  });

  describe('revokeKakaoUser', () => {
    it('Kakao Access Token이 주어졌을 때, 회원탈퇴 요청을 하면, 성공메세지를 반환한다', async () => {
      // Given
      const accessToken = 'kakao-access-token';
      const userId = 12345;
      jest.spyOn(kakaoAuthService, 'unlinkUser').mockResolvedValue(userId);

      // When
      const result = await service.revokeKakaoUser(accessToken);

      // Then
      expect(result).toBe(userId);
      expect(kakaoAuthService.unlinkUser).toHaveBeenCalledWith(accessToken);
    });
  });
});
