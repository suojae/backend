import { Test, TestingModule } from '@nestjs/testing';
import { AppleAuthService } from '../../../src/auth/infrastructure/external-services/apple-auth.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AppleAuthService', () => {
  let service: AppleAuthService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppleAuthService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppleAuthService>(AppleAuthService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('getAccessToken', () => {
    it('유효한 인증 코드가 주어졌을 때, Apple 서버로 요청하면, 액세스 토큰을 반환한다', async () => {
      // Given
      const authCode = 'valid_auth_code';
      const accessToken = 'access_token';
      const response: AxiosResponse = {
        data: { access_token: accessToken },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));

      // When
      const result = await (service as any).getAccessToken(authCode);

      // Then
      expect(result).toBe(accessToken);
    });

    it('유효한 인증 코드가 주어졌을 때, Apple 서버로부터 accessToken이 누락된 응답을 받으면, BadRequestException을 던진다', async () => {
      // Given
      const authCode = 'valid_auth_code';
      const response: AxiosResponse = {
        data: {}, // access_token 없음
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));

      // When & Then
      await expect((service as any).getAccessToken(authCode)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('유효한 인증 코드가 주어졌을 때, Apple 서버 호출 중 네트워크 에러가 발생하면, BadRequestException을 던진다', async () => {
      // Given
      const authCode = 'valid_auth_code';
      const errorMessage = 'Network error';
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error(errorMessage)));

      // When & Then
      await expect((service as any).getAccessToken(authCode)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('revokeAccessToken', () => {
    it('유효한 액세스 토큰이 주어졌을 때, Apple 서버로 회원탈퇴 요청을 전송하면, 성공 메시지를 반환한다', async () => {
      // Given
      const accessToken = 'valid_access_token';
      const response: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: undefined,
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));

      // When
      const result = await service.revokeAccessToken(accessToken);

      // Then
      expect(result).toBe('Apple 유저 회원탈퇴가 성공적으로 처리되었습니다');
    });

    it('유효한 액세스 토큰이 주어졌을 때, Apple 서버로부터 응답 상태가 200이 아닌 경우, InternalServerErrorException을 던진다', async () => {
      // Given
      const accessToken = 'valid_access_token';
      const response: AxiosResponse = {
        data: {},
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: undefined,
      };
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));

      // When & Then
      await expect(service.revokeAccessToken(accessToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('유효한 액세스 토큰이 주어졌을 때, Apple 서버 호출 중 네트워크 에러가 발생하면, InternalServerErrorException을 던진다', async () => {
      // Given
      const accessToken = 'valid_access_token';
      const errorMessage = 'Network error';
      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(throwError(() => new Error(errorMessage)));

      // When & Then
      await expect(service.revokeAccessToken(accessToken)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
