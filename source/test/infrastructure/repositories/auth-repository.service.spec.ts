import { Test, TestingModule } from '@nestjs/testing';
import { AuthRepository } from '../../../src/auth/infrastructure/repositories/auth.repository';
import { ExternalAuthService } from '../../../src/auth/infrastructure/api-services/external-auth.service';
import { CacheAsideService } from '../../../src/auth/infrastructure/db-services/cache-aside.service';
import { AuthTokenDAO } from '../../../src/auth/infrastructure/dao/auth-token.dao';
import { RedisService } from '../../../src/auth/infrastructure/db-services/redis.service';
import { JwtService } from '../../../src/auth/infrastructure/util-services/jwt.service';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let externalAuthService: ExternalAuthService;
  let cacheAsideService: CacheAsideService<AuthTokenDAO>;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: ExternalAuthService,
          useValue: {
            authenticateWithKakao: jest.fn(),
            authentiacteWithApple: jest.fn(),
          },
        },
        {
          provide: CacheAsideService,
          useValue: {
            saveData: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            generateAccessToken: jest.fn(),
            generateRefreshToken: jest.fn(),
            verifyAccessToken: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    externalAuthService = module.get<ExternalAuthService>(ExternalAuthService);
    cacheAsideService =
      module.get<CacheAsideService<AuthTokenDAO>>(CacheAsideService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('authenticateKakao', () => {
    it('주어진 유저 UUID와 Kakao 인증 코드가 있을 때, Kakao 인증을 수행하고, JWT 토큰을 반환한다', async () => {
      // Given
      const userUuid = 'test-uuid';
      const authCode = 'test-auth-code';
      const kakaoAccessToken = 'kakao-access-token';
      const accessToken = 'jwt-access-token';
      const refreshToken = 'jwt-refresh-token';

      jest
        .spyOn(externalAuthService, 'authenticateWithKakao')
        .mockResolvedValue(kakaoAccessToken);
      jest.spyOn(cacheAsideService, 'saveData').mockResolvedValue(undefined);
      jest
        .spyOn(jwtService, 'generateAccessToken')
        .mockReturnValue(accessToken);
      jest
        .spyOn(jwtService, 'generateRefreshToken')
        .mockReturnValue(refreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      const result = await authRepository.authenticateKakao(userUuid, authCode);

      // Then
      expect(externalAuthService.authenticateWithKakao).toHaveBeenCalledWith(
        authCode,
      );
      expect(cacheAsideService.saveData).toHaveBeenCalledWith(
        `access-token:${userUuid}:kakao`,
        expect.objectContaining({
          user_uuid: userUuid,
          access_token: kakaoAccessToken,
        }),
      );
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
        userUuid,
        provider: 'kakao',
      });
      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({
        userUuid,
        provider: 'kakao',
      });
      expect(redisService.set).toHaveBeenCalledWith(
        `refresh-token:${userUuid}:kakao`,
        refreshToken,
        30 * 24 * 3600,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('authenticateApple', () => {
    it('주어진 유저 UUID와 Apple 인증 코드가 있을 때, Apple 인증을 수행하고, JWT 토큰을 반환한다', async () => {
      // Given
      const userUuid = 'test-uuid';
      const authCode = 'test-auth-code';
      const appleAccessToken = 'apple-access-token';
      const accessToken = 'jwt-access-token';
      const refreshToken = 'jwt-refresh-token';

      jest
        .spyOn(externalAuthService, 'authentiacteWithApple')
        .mockResolvedValue(appleAccessToken);
      jest.spyOn(cacheAsideService, 'saveData').mockResolvedValue(undefined);
      jest
        .spyOn(jwtService, 'generateAccessToken')
        .mockReturnValue(accessToken);
      jest
        .spyOn(jwtService, 'generateRefreshToken')
        .mockReturnValue(refreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      const result = await authRepository.authenticateApple(userUuid, authCode);

      // Then
      expect(externalAuthService.authentiacteWithApple).toHaveBeenCalledWith(
        authCode,
      );
      expect(cacheAsideService.saveData).toHaveBeenCalledWith(
        `access-token:${userUuid}:apple`,
        expect.objectContaining({
          user_uuid: userUuid,
          access_token: appleAccessToken,
        }),
      );
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith({
        userUuid,
        provider: 'apple',
      });
      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({
        userUuid,
        provider: 'apple',
      });
      expect(redisService.set).toHaveBeenCalledWith(
        `refresh-token:${userUuid}:apple`,
        refreshToken,
        30 * 24 * 3600,
      );
      expect(result).toEqual({ accessToken, refreshToken });
    });
  });

  describe('validateAccessToken', () => {
    it('유효한 Access Token이 전달되었을 때, 페이로드를 반환한다', async () => {
      // Given
      const validAccessToken = 'valid-access-token';
      const payload = { userUuid: 'test-uuid', provider: 'kakao' };

      jest.spyOn(jwtService, 'verifyAccessToken').mockReturnValue(payload);

      // When
      const result = await authRepository.validateAccessToken(validAccessToken);

      // Then
      expect(jwtService.verifyAccessToken).toHaveBeenCalledWith(
        validAccessToken,
      );
      expect(result).toEqual(payload);
    });

    it('만료되었거나 잘못된 Access Token이 전달되었을 때, 예외를 던진다', async () => {
      // Given
      const invalidAccessToken = 'invalid-access-token';

      jest.spyOn(jwtService, 'verifyAccessToken').mockImplementation(() => {
        throw new Error('Invalid or expired access token');
      });

      // When & Then
      await expect(
        authRepository.validateAccessToken(invalidAccessToken),
      ).rejects.toThrow('Invalid or expired access token');
      expect(jwtService.verifyAccessToken).toHaveBeenCalledWith(
        invalidAccessToken,
      );
    });
  });

  describe('reissueTokens', () => {
    it('유효한 Refresh Token이 전달되었을 때, 새로운 Access Token과 Refresh Token을 반환한다', async () => {
      // Given
      const userUuid = 'test-uuid';
      const refreshToken = 'valid-refresh-token';
      const storedRefreshToken = 'valid-refresh-token';
      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      jest.spyOn(redisService, 'get').mockResolvedValue(storedRefreshToken);
      jest
        .spyOn(jwtService, 'generateAccessToken')
        .mockReturnValue(newAccessToken);
      jest
        .spyOn(jwtService, 'generateRefreshToken')
        .mockReturnValue(newRefreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      const result = await authRepository.reissueTokens(userUuid, refreshToken);

      // Then
      expect(redisService.get).toHaveBeenCalledWith(
        `refresh-token:${userUuid}`,
      );
      expect(jwtService.generateAccessToken).toHaveBeenCalledWith({ userUuid });
      expect(jwtService.generateRefreshToken).toHaveBeenCalledWith({
        userUuid,
      });
      expect(redisService.set).toHaveBeenCalledWith(
        `refresh-token:${userUuid}`,
        newRefreshToken,
        30 * 24 * 3600,
      );
      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    });

    it('유효하지 않은 Refresh Token이 전달되었을 때, 예외를 던진다', async () => {
      // Given
      const userUuid = 'test-uuid';
      const refreshToken = 'invalid-refresh-token';
      const storedRefreshToken = 'valid-refresh-token'; // Redis에 저장된 토큰과 불일치

      jest.spyOn(redisService, 'get').mockResolvedValue(storedRefreshToken);

      // When & Then
      await expect(
        authRepository.reissueTokens(userUuid, refreshToken),
      ).rejects.toThrow('Invalid or expired refresh token');
      expect(redisService.get).toHaveBeenCalledWith(
        `refresh-token:${userUuid}`,
      );
    });

    it('Redis에 Refresh Token이 존재하지 않을 때, 예외를 던진다', async () => {
      // Given
      const userUuid = 'test-uuid';
      const refreshToken = 'non-existent-refresh-token';

      jest.spyOn(redisService, 'get').mockResolvedValue(null); // Redis에서 토큰이 없음

      // When & Then
      await expect(
        authRepository.reissueTokens(userUuid, refreshToken),
      ).rejects.toThrow('Invalid or expired refresh token');
      expect(redisService.get).toHaveBeenCalledWith(
        `refresh-token:${userUuid}`,
      );
    });
  });
});
