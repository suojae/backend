import { Injectable } from '@nestjs/common';
import { AuthTokenDAO } from '../dao/auth-token.dao';
import { ExternalAuthService } from '../api-services/external-auth.service';
import { CacheAsideService } from '../db-services/cache-aside.service';
import { JwtService } from '../util-services/jwt.service';
import { RedisService } from '../db-services/redis.service';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly externalAuthService: ExternalAuthService,
    private readonly cacheAsideService: CacheAsideService<AuthTokenDAO>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Kakao 인증 및 토큰 처리
   */
  async authenticateKakao(
    userUuid: string,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const kakaoAccessToken =
      await this.externalAuthService.authenticateWithKakao(authCode);
    await this.saveProviderAccessToken(userUuid, 'kakao', kakaoAccessToken);
    return this.generateBackendTokens(userUuid, 'kakao');
  }

  /**
   * Apple 인증 및 토큰 처리
   */
  async authenticateApple(
    userUuid: string,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const appleAccessToken =
      await this.externalAuthService.authentiacteWithApple(authCode);
    await this.saveProviderAccessToken(userUuid, 'apple', appleAccessToken);
    return this.generateBackendTokens(userUuid, 'apple');
  }

  /**
   * Access Token 검증 및 자동 로그인
   * @param accessToken 프론트에서 전달된 Access Token
   * @returns 사용자 정보 페이로드
   */
  async validateAccessToken(accessToken: string): Promise<any> {
    try {
      // Access Token 검증
      return this.jwtService.verifyAccessToken(accessToken); // 사용자 정보 반환
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Access Token과 Refresh Token으로 토큰 재발급 (RTR)
   * @param userUuid 사용자 UUID
   * @param refreshToken 프론트에서 전달된 Refresh Token
   * @returns 재발급된 Access Token 및 Refresh Token
   */
  async reissueTokens(
    userUuid: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Redis에서 Refresh Token 검증
    const refreshTokenKey = `refresh-token:${userUuid}`;
    const storedRefreshToken = await this.redisService.get(refreshTokenKey);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    // 2. 새 Access Token 및 Refresh Token 생성
    const newAccessToken = this.jwtService.generateAccessToken({ userUuid });
    const newRefreshToken = this.jwtService.generateRefreshToken({ userUuid });

    // 3. Redis에 새 Refresh Token 저장 (기존 Refresh Token 무효화)
    await this.redisService.set(
      refreshTokenKey,
      newRefreshToken,
      30 * 24 * 3600,
    ); // 30일 TTL

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Provider Access Token 저장
   */
  private async saveProviderAccessToken(
    userUuid: string,
    provider: string,
    accessToken: string,
  ): Promise<void> {
    const cacheKey = `access-token:${userUuid}:${provider}`;
    const authToken = this.createAuthToken(userUuid, provider, accessToken);
    await this.cacheAsideService.saveData(cacheKey, authToken);
  }

  /**
   * AuthTokenDAO 객체 생성
   */
  private createAuthToken(
    userUuid: string,
    provider: string,
    accessToken: string,
  ): AuthTokenDAO {
    return {
      id: `${userUuid}-${provider}`,
      user_uuid: userUuid,
      access_token: accessToken,
      refresh_token: null,
      access_token_expiry: new Date(Date.now() + 3600 * 1000),
      refresh_token_expiry: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  /**
   * Backend Access Token 및 Refresh Token 생성
   */
  private async generateBackendTokens(
    userUuid: string,
    provider: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.generateAccessToken({
      userUuid,
      provider,
    });
    const refreshToken = this.jwtService.generateRefreshToken({
      userUuid,
      provider,
    });
    await this.storeRefreshTokenInRedis(userUuid, provider, refreshToken);
    return { accessToken, refreshToken };
  }

  /**
   * Refresh Token을 Redis에 저장
   */
  private async storeRefreshTokenInRedis(
    userUuid: string,
    provider: string,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenKey = `refresh-token:${userUuid}:${provider}`;
    const ttl = 30 * 24 * 3600; // 30일 TTL
    await this.redisService.set(refreshTokenKey, refreshToken, ttl);
  }
}
