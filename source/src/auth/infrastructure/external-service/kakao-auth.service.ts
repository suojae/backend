import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import * as process from 'node:process';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoAuthService {
  private readonly KAKAO_TOKEN_URL = 'https://api.kakao.com/oauth/token';
  private readonly KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  private readonly KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
  private readonly KAKAO_UNLINK_URI = process.env.KAKAO_UNLINK_URI;

  constructor(private readonly httpservice: HttpService) {}

  /**
   * Authorization Code를 사용해 Kakao 서버로부터 Access Token을 가져옵니다.
   * @param authCode 프론트에서 전달받은 Authorization Code
   * @returns Access Token
   */
  async getAccessToken(authCode: string): Promise<string> {
    try {
      const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.KAKAO_CLIENT_ID,
        redirect_uri: this.KAKAO_REDIRECT_URI,
        code: authCode,
      });

      const response: AxiosResponse = await firstValueFrom(
        this.httpservice.post(this.KAKAO_TOKEN_URL, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const { access_token } = response.data;
      if (!access_token) {
        throw new InternalServerErrorException(
          'kakao로 부터 access token을 가져오는 것에 실패했습니다',
        );
      }
      return access_token;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Kakao 회원탈퇴 API호출
   * @param accessToken 이전에 카카오가 주었던 사용자 Access Token
   * @returns 성공적으로 탈퇴한 회원 ID
   */
  async unlinkUser(accessToken: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpservice.post(
          this.KAKAO_UNLINK_URI,
          {}, // 요청바디는 비어있음
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, //인증헤더 추가
            },
          },
        ),
      );

      const { id } = response.data;

      if (!id) {
        throw new InternalServerErrorException(
          'Kakao로부터 User를 Unlink하는데 실패했습니다',
        );
      }
      return id;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
