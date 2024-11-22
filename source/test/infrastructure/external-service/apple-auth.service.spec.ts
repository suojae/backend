import { AppleAuthService } from '../../../src/auth/infrastructure/external-service/apple-auth.service';
import { HttpService } from '@nestjs/axios';
import MockAdapter from 'axios-mock-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

describe('AppleAuthService', () => {
  let service: AppleAuthService;
  let httpService: HttpService;
  let mockAxios: MockAdapter;

  const mockAppleTokenUrl = 'https://appleid.apple.com/auth/token';
  const mockRevokeUrl = 'https://appleid.apple.com/revoke';
  const mockAuthCode = 'mockAuthCode';
  const mockAccessToken = 'mockAccessToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppleAuthService, HttpService],
    }).compile();

    service = module.get<AppleAuthService>(AppleAuthService);
    httpService = module.get<HttpService>(HttpService);

    mockAxios = new MockAdapter(axios);
  });

  describe('getAcessToken', () => {
    it('Apple API가 응답을 반환하면 Access Token을 반환해야한다', async () => {
      // Given: Mock Apple API 응답 설정
      mockAxios.onPost(mockAppleTokenUrl).reply(200, {
        access_token: mockAccessToken,
      });

      // When: getAccessToken 호출
      const result = await service['getAcessToken'](mockAuthCode);

      // Then: 올바른 Access Token 반환
      expect(result).toEqual(mockAccessToken);
    });
  });
});
