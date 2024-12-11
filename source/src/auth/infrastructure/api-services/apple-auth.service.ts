import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as process from 'process';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import { AxiosResponse } from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import { AppleUserInfoResponseDto } from '../dto/apple-auth/apple-user-info-response.dto';
import { SocialUserInfoDto } from '../dto/auth-common/social-user-info.dto';
import { SocialTokenResponseDto } from '../dto/auth-common/social-token-response.dto';
import { SocialRevokeResponseDto } from '../dto/auth-common/social-revoke-response.dto';

@Injectable()
export class AppleAuthService {
  private readonly APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';
  private readonly APPLE_KEYS_URL = 'https://appleid.apple.com/auth/keys';
  private readonly APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
  private readonly APPLE_TEAM_ID = process.env.APPLE_TEAM_ID;
  private readonly APPLE_KEY_ID = process.env.APPLE_KEY_ID;
  private readonly APPLE_PRIVATE_KEY_PATH = process.env.APPLE_PRIVATE_KEY_PATH;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Authorization Code를 사용해 Apple 서버로부터 Access Token 및 ID Token을 가져옵니다.
   * @param authCode Authorization Code를 포함한 DTO
   * @returns Access Token 및 ID Token을 포함한 DTO
   */
  async getTokens(
    authCode: string,
  ): Promise<SocialTokenResponseDto> {
    try {
      const clientSecret = this.generateClientSecret();

      const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        client_id: this.APPLE_CLIENT_ID,
        client_secret: clientSecret,
      });

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(this.APPLE_TOKEN_URL, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const { access_token, id_token } = response.data;
      if (!access_token || !id_token) {
        throw new BadRequestException(
          'Apple로부터 토큰을 가져오는 데 실패했습니다.',
        );
      }

      return { accessToken: access_token, idToken: id_token };
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.error_description ||
          'Apple 토큰 요청 중 오류 발생',
      );
    }
  }

  /**
   * ID Token을 사용하여 Apple 사용자 정보를 가져옵니다.
   * @param userInfoDto ID Token을 포함한 DTO
   * @returns 사용자 정보 DTO
   */
  async getUserInfo(
    userInfoDto: SocialUserInfoDto,
  ): Promise<AppleUserInfoResponseDto> {
    const { idToken } = userInfoDto;
    try {
      // Apple의 공개 키를 가져옵니다.
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(this.APPLE_KEYS_URL),
      );

      const appleKeys = response.data.keys;

      // ID Token 검증 및 디코딩
      const decodedToken = jwt.decode(idToken, { complete: true });

      if (!decodedToken) {
        throw new BadRequestException('유효하지 않은 ID Token입니다.');
      }

      const kid = decodedToken.header.kid;
      const alg = decodedToken.header.alg;

      const appleKey = appleKeys.find(
        (key) => key.kid === kid && key.alg === alg,
      );

      if (!appleKey) {
        throw new BadRequestException(
          '적절한 Apple 공개 키를 찾을 수 없습니다.',
        );
      }

      // 공개 키를 PEM 형식으로 변환
      const publicKey = this.getPublicKey(appleKey);

      // 공개 키를 사용하여 토큰 검증
      const payload = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
      });

      return payload as AppleUserInfoResponseDto;
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Apple 사용자 정보 가져오는 중 오류 발생',
      );
    }
  }

  /**
   * Apple 공개 키를 PEM 형식으로 변환합니다.
   * @param key Apple 공개 키 정보
   * @returns PEM 형식의 공개 키
   */
  private getPublicKey(key): string {
    // jwk-to-pem을 사용하여 JWK를 PEM 형식으로 변환
    const pem = jwkToPem(key);
    return pem;
  }

  /**
   * Apple 클라이언트 시크릿을 생성합니다.
   * @returns client_secret
   */
  private generateClientSecret(): string {
    // Apple 개발자 계정의 키를 사용하여 JWT를 생성해야 합니다.
    const privateKey = fs.readFileSync(
      path.join(__dirname, this.APPLE_PRIVATE_KEY_PATH),
      'utf8',
    );

    const claims = {
      iss: this.APPLE_TEAM_ID, // Apple Developer Account의 Team ID
      iat: Math.floor(Date.now() / 1000), // 현재 시간
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 180, // 6개월 후 만료
      aud: 'https://appleid.apple.com',
      sub: this.APPLE_CLIENT_ID, // 앱의 Bundle ID 또는 서비스 ID
    };

    const headers = {
      kid: this.APPLE_KEY_ID, // Apple에서 발급받은 Key ID
      alg: 'ES256',
    };

    // JWT 생성
    const clientSecret = jwt.sign(claims, privateKey, {
      algorithm: 'ES256',
      header: headers,
    });

    return clientSecret;
  }

  /**
   * Apple 서버로 회원탈퇴 요청을 전송합니다.
   * @param revokeRequestDto Access Token을 포함한 DTO
   * @returns 성공 메시지를 포함한 DTO
   */
  async revokeAccessToken(revokeRequestDto: {
    accessToken: string;
  }): Promise<SocialRevokeResponseDto> {
    const { accessToken } = revokeRequestDto;
    try {
      const clientSecret = this.generateClientSecret();

      const payload = new URLSearchParams({
        token: accessToken,
        token_type_hint: 'access_token',
        client_id: this.APPLE_CLIENT_ID,
        client_secret: clientSecret,
      });

      const response = await firstValueFrom(
        this.httpService.post(
          'https://appleid.apple.com/auth/revoke',
          payload.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      if (response.status === 200) {
        return { message: 'Apple 유저 회원탈퇴가 성공적으로 처리되었습니다.' };
      }

      throw new InternalServerErrorException(
        'Apple 유저 회원탈퇴에 실패했습니다.',
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.error_description ||
          'Apple Revoke 요청 중 오류 발생',
      );
    }
  }
}
