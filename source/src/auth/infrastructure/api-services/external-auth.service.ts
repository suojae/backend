import { Injectable, BadRequestException } from '@nestjs/common';
import { AppleAuthService } from './apple-auth.service';
import { KakaoAuthService } from './kakao-auth.service';
import { SocialAuthCodeDto } from '../dto/auth-common/social-auth-code.dto';
import { SocialProvider } from '../../domain/social-provider.type';
import { SocialTokenResponseDto } from '../dto/auth-common/social-token-response.dto';
import { SocialUserInfoDto } from '../dto/auth-common/social-user-info.dto';
import { SocialRevokeResponseDto } from '../dto/auth-common/social-revoke-response.dto';

@Injectable()
export class ExternalAuthService {
  constructor(
    private readonly appleAuthService: AppleAuthService,
    private readonly kakaoAuthService: KakaoAuthService,
  ) {}

  /**
   * 소셜 인증을 처리합니다.
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param authCodeDto 인증 코드 DTO
   * @returns 액세스 토큰 및 ID 토큰 DTO
   */
  async authenticate(
    socialProvider: SocialProvider,
    authCodeDto: SocialAuthCodeDto,
  ): Promise<SocialTokenResponseDto> {
    switch (socialProvider) {
      case 'apple':
        return await this.appleAuthService.getTokens(authCodeDto);
      case 'kakao':
        return await this.kakaoAuthService.getAccessToken(authCodeDto);
      default:
        throw new BadRequestException('지원하지 않는 소셜 제공자입니다.');
    }
  }

  /**
   * 소셜 사용자 정보를 가져옵니다.
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param userInfoDto 사용자 정보 요청 DTO
   * @returns 사용자 정보 DTO
   */
  async getUserInfo(
    socialProvider: SocialProvider,
    userInfoDto: SocialUserInfoDto,
  ): Promise<any> {
    switch (socialProvider) {
      case 'apple':
        return await this.appleAuthService.getUserInfo(userInfoDto);
      case 'kakao':
        return await this.kakaoAuthService.getUserInfo(userInfoDto);
      default:
        throw new BadRequestException('지원하지 않는 소셜 제공자입니다.');
    }
  }

  /**
   * 소셜 사용자 회원탈퇴를 처리합니다.
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param accessToken 액세스 토큰 DTO
   * @returns 회원탈퇴 결과 DTO
   */
  async revokeUser(
    socialProvider: SocialProvider,
    accessToken: string,
  ): Promise<SocialRevokeResponseDto> {
    switch (socialProvider) {
      case 'apple':
        return await this.appleAuthService.revokeAccessToken({ accessToken });
      case 'kakao':
        return await this.kakaoAuthService.unlinkUser({ accessToken });
      default:
        throw new BadRequestException('지원하지 않는 소셜 제공자입니다.');
    }
  }
}
