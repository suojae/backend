import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as process from 'node:process';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppleAuthService {
  private readonly APPLE_TOKEN_URL = 'https://appleid.apple.com/auth/token';
  private readonly APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;

  constructor(private readonly httpService: HttpService) {}

  /**
   * Authorization Code를 사용해 Apple 서버로부터 Access Token을 가져옵니다.
   * @param authCode 프론트에서 전달받은 Authorization Code
   * @returns Access Token
   */
  private async getAccessToken(authCode: string): Promise<string> {
    try {
      const payload = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        client_id: this.APPLE_CLIENT_ID,
      });

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(this.APPLE_TOKEN_URL, payload.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      const { access_token } = response.data;
      if (!access_token) {
        throw new BadRequestException(
          'Apple로 부터 access token을 가져오는 것에 실패했습니다',
        );
      }

      return access_token;
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.message || 'Apple Access Token 요청 중 오류 발생',
      );
    }
  }

  /**
   * Apple 서버로 회원탈퇴 요청을 전송합니다.
   * @param accessToken Apple에서 발급한 Access Token
   * @returns 성공 메시지
   */
  async revokeAccessToken(accessToken: string): Promise<string> {
    try {
      const payload = new URLSearchParams({
        token: accessToken,
        token_type_hint: 'access_token',
        client_id: this.APPLE_CLIENT_ID,
        client_secret: accessToken,
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
        return 'Apple 유저 회원탈퇴가 성공적으로 처리되었습니다';
      }

      throw new InternalServerErrorException(
        'Apple 유저 회원탈퇴에 실패했습니다',
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Apple Revoke 요청 중 오류 발생',
      );
    }
  }
}
