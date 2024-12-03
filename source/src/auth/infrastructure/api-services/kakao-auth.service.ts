import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';
import { KakaoUserInfoResponseDto } from '../dto/kakao-auth/kakao-user-info-response.dto';
import { SocialAuthCodeDto } from '../dto/auth-common/social-auth-code.dto';
import { SocialTokenResponseDto } from '../dto/auth-common/social-token-response.dto';
import { SocialUserInfoDto } from '../dto/auth-common/social-user-info.dto';
import { SocialRevokeResponseDto } from '../dto/auth-common/social-revoke-response.dto';

@Injectable()
export class KakaoAuthService {
  private readonly KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  private readonly KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';
  private readonly KAKAO_UNLINK_URL = 'https://kapi.kakao.com/v1/user/unlink';
  private readonly KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  private readonly KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Authorization Code를 사용해 Kakao 서버로부터 Access Token을 가져옵니다.
   * @param authCodeDto Authorization Code를 포함한 DTO
   * @returns Access Token을 포함한 DTO
   */
  async getAccessToken(
    authCodeDto: SocialAuthCodeDto,
  ): Promise<SocialTokenResponseDto> {
    const { authCode } = authCodeDto;
    try {
      const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.KAKAO_CLIENT_ID,
        redirect_uri: this.KAKAO_REDIRECT_URI,
        code: authCode,
      });

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(this.KAKAO_TOKEN_URL, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const { access_token } = response.data;
      if (!access_token) {
        throw new InternalServerErrorException(
          'Kakao로부터 Access Token을 가져오는 데 실패했습니다.',
        );
      }
      return { accessToken: access_token };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Access Token을 사용하여 Kakao 사용자 정보를 가져옵니다.
   * @param userInfoDto Access Token을 포함한 DTO
   * @returns 사용자 정보 DTO
   */
  async getUserInfo(
    userInfoDto: SocialUserInfoDto,
  ): Promise<KakaoUserInfoResponseDto> {
    const { accessToken } = userInfoDto;
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.KAKAO_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return response.data as KakaoUserInfoResponseDto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Kakao 사용자 정보를 가져오는 데 실패했습니다.',
      );
    }
  }

  /**
   * Kakao 회원탈퇴 API 호출
   * @param unlinkRequestDto Access Token을 포함한 DTO
   * @returns 성공적으로 탈퇴한 회원 ID를 포함한 DTO
   */
  async unlinkUser(unlinkRequestDto: {
    accessToken: string;
  }): Promise<SocialRevokeResponseDto> {
    const { accessToken } = unlinkRequestDto;
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.KAKAO_UNLINK_URL,
          {}, // 요청 바디는 비어있음
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
            },
          },
        ),
      );

      const { id } = response.data;

      if (!id) {
        throw new InternalServerErrorException(
          'Kakao로부터 회원 탈퇴에 실패했습니다.',
        );
      }
      return { id };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
