import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ExternalAuthService } from '../api-services/external-auth.service';
import { CacheAsideService } from '../db-services/cache-aside.service';
import { JwtService } from '../util-services/jwt.service';
import { RedisService } from '../db-services/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../../domain/user.entity';
import { AuthTokenDAO } from '../dao/auth-token.dao';
import { SocialProvider } from '../../domain/social-provider.type';
import { SocialAuthCodeDto } from '../dto/auth-common/social-auth-code.dto';
import { SocialTokenResponseDto } from '../dto/auth-common/social-token-response.dto';
import { SocialUserInfoDto } from '../dto/auth-common/social-user-info.dto';
import { IAuthRepository } from '../../domain/auth.repository.interface';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly externalAuthService: ExternalAuthService,
    private readonly cacheAsideService: CacheAsideService<AuthTokenDAO>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * 소셜 로그인 처리 및 사용자 UUID 반환
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param authCode 인증 코드
   * @returns 사용자 UUID
   */
  async registerUser(
    socialProvider: SocialProvider,
    authCode: string,
  ): Promise<string> {
    // 1. 소셜 인증을 통해 액세스 토큰 및 ID 토큰 획득
    const authCodeDto: SocialAuthCodeDto = { authCode };
    const tokenResponse: SocialTokenResponseDto =
      await this.externalAuthService.authenticate(socialProvider, authCodeDto);

    // 2. 사용자 정보 요청 DTO 생성
    const userInfoDto: SocialUserInfoDto = {
      accessToken: tokenResponse.accessToken,
      idToken: tokenResponse.idToken,
    };

    // 3. 소셜 사용자 정보 가져오기
    const userInfo = await this.externalAuthService.getUserInfo(
      socialProvider,
      userInfoDto,
    );

    // 4. 소셜 사용자 ID 추출
    let socialUserId: string;
    switch (socialProvider) {
      case 'kakao':
        socialUserId = userInfo.id.toString();
        break;
      case 'apple':
        socialUserId = userInfo.sub;
        break;
      default:
        throw new BadRequestException('지원하지 않는 소셜 제공자입니다.');
    }

    // 5. 소셜 사용자 ID로 사용자 조회 또는 생성
    let user = await this.userRepository.findBySocialId(
      socialProvider,
      socialUserId,
    );

    if (!user) {
      const newUserUuid = uuidv4();
      user = new UserEntity();
      user.id = newUserUuid;
      user.socialProvider = socialProvider;
      user.socialId = socialUserId;
      await this.userRepository.save(user);
    }

    // 6. 사용자 UUID 반환
    return user.id;
  }

  /**
   * 소셜 인증 및 토큰 처리
   * @param userUuid 사용자 UUID
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param authCode 인증 코드
   * @returns 백엔드 액세스 토큰 및 리프레시 토큰
   */
  async authenticateSocial(
    userUuid: string,
    socialProvider: SocialProvider,
    authCode: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. 소셜 인증을 통해 액세스 토큰 및 ID 토큰 획득
    const authCodeDto: SocialAuthCodeDto = { authCode };
    const tokenResponse: SocialTokenResponseDto =
      await this.externalAuthService.authenticate(socialProvider, authCodeDto);

    // 2. Provider Access Token 저장
    await this.saveProviderAccessToken(
      userUuid,
      socialProvider,
      tokenResponse.accessToken,
    );

    // 3. 백엔드 토큰 생성
    return this.generateBackendTokens(userUuid, socialProvider);
  }

  /**
   * 회원탈퇴 처리
   * @param userUuid 사용자 UUID
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   */
  async withdraw(
    userUuid: string,
    socialProvider: SocialProvider,
  ): Promise<void> {
    // 1. MySQL 사용자 데이터 삭제
    await this.userRepository.deleteById(userUuid);

    // 2. Redis 캐시 삭제
    const refreshTokenKey = `refresh-token:${userUuid}`;
    await this.redisService.del(refreshTokenKey);

    // 3. 소셜 서비스 연결 끊기
    await this.externalAuthService.revokeUser(socialProvider, userUuid);
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
      throw new Error(`Invalid or expired access token: ${error}`);
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
    provider: SocialProvider,
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
    provider: SocialProvider,
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
   * 백엔드 액세스 토큰 및 리프레시 토큰 생성
   */
  private async generateBackendTokens(
    userUuid: string,
    provider: SocialProvider,
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
   * 로그아웃 처리
   * @param userUuid 사용자 UUID
   * @param accessToken 액세스 토큰
   * @param refreshToken 리프레시 토큰
   */
  async logout(
    userUuid: string,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    // 1. Refresh Token 검증
    const refreshTokenKey = `refresh-token:${userUuid}`;
    const storedRefreshToken =
      await this.redisService.get<string>(refreshTokenKey);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    // 2. Access Token을 블랙리스트에 추가
    const decodedToken = this.jwtService.verifyAccessToken(accessToken);

    const accessTokenKey = `blacklist:access-token:${accessToken}`;
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간
    const ttl = decodedToken.exp - currentTime; // 남은 TTL 계산

    if (ttl > 0) {
      await this.redisService.set(accessTokenKey, true, ttl);
    }

    // 3. Refresh Token 삭제
    await this.redisService.del(refreshTokenKey);
  }

  /**
   * Refresh Token을 Redis에 저장
   */
  private async storeRefreshTokenInRedis(
    userUuid: string,
    provider: SocialProvider,
    refreshToken: string,
  ): Promise<void> {
    const refreshTokenKey = `refresh-token:${userUuid}:${provider}`;
    const ttl = 30 * 24 * 3600; // 30일 TTL
    await this.redisService.set(refreshTokenKey, refreshToken, ttl);
  }
}
