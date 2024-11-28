import { KakaoAuthService } from '../../../src/auth/infrastructure/api-services/kakao-auth.service';
import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('KakaoAuthService', () => {
  let kakaoAuthService: KakaoAuthService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
  };

  beforeAll(() => {
    process.env.KAKAO_CLIENT_ID = 'test_client_id';
    process.env.KAKAO_REDIRECT_URI = 'test_redirect_uri';
    process.env.KAKAO_UNLINK_URI = 'test_unlink_uri';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KakaoAuthService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    kakaoAuthService = module.get<KakaoAuthService>(KakaoAuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('유효한 인증코드가 주어지고, accessToken을 요청했을 때, accessToken을 반환한다', async () => {
      // Given
      const authCode = 'valid_auth_code';
      const mockResponse: AxiosResponse = {
        data: { access_token: 'mockAccessToken' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // When
      const result = await kakaoAuthService.getAccessToken(authCode);

      // Then
      expect(result).toBe('mockAccessToken');
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'https://api.kakao.com/oauth/token',
        expect.any(String),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    });

    it('유효하지 않은 인증코드가 주어졌을때, 카카오 응답으로 엑세스토큰이 없으면, BadRequestException을 던진다', async () => {
      // Given
      const authCode = 'invalid_auth_code';
      const mockResponse: AxiosResponse = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: undefined,
      };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // When & Then
      await expect(kakaoAuthService.getAccessToken(authCode)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('카카오 요청 중 에러가 발생했을 때, BadRequestException을 던진다', async () => {
      // Given
      const authCode = 'invalid_auth_code';
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Request failed')),
      );

      // When & Then
      await expect(kakaoAuthService.getAccessToken(authCode)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('unlinkUser', () => {
    it('유효한 엑세스 토큰이 주어졌을 때, 성공적으로 회원탈퇴하며 사용자 ID를 반환한다', async () => {
      // Given
      const accessToken = 'validAccessToken';
      const mockResponse: AxiosResponse = {
        data: { id: 12345 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // When
      const result = await kakaoAuthService.unlinkUser(accessToken);

      // Then
      expect(result).toBe(12345);
      expect(mockHttpService.post).toHaveBeenCalledWith(
        'test_unlink_uri',
        {},
        expect.objectContaining({
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
    });

    it('유효한 엑세스 토큰이 주어졌지만, 응답에서 ID가 없으면, InternalServerErrorException을 던진다', async () => {
      // Given
      const accessToken = 'validAccessToken';
      const mockResponse: AxiosResponse = {
        data: {}, // No id in response
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      // When & Then
      await expect(kakaoAuthService.unlinkUser(accessToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('카카오 요청 중 에러가 발생했을 때, InternalServerErrorException을 던진다', async () => {
      // Given
      const accessToken = 'invalidAccessToken';
      mockHttpService.post.mockReturnValue(
        throwError(() => new Error('Request failed')),
      );

      // When & Then
      await expect(kakaoAuthService.unlinkUser(accessToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
