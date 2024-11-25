import { Test, TestingModule } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from '../../../src/auth/infrastructure/services/jwt.service';

describe('JwtService 단위 테스트', () => {
  let jwtService: JwtService;
  let mockNestJwtService: Partial<NestJwtService>;

  beforeEach(async () => {
    mockNestJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        { provide: NestJwtService, useValue: mockNestJwtService },
      ],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('주어진 payload로, access 토큰을 생성하면, 1시간 유효기간의 토큰을 반환한다', () => {
    // Given
    const payload = { userId: 1 };
    mockNestJwtService.sign = jest.fn().mockReturnValue('accessToken');

    // When
    const token = jwtService.generateAccessToken(payload);

    // Then
    expect(mockNestJwtService.sign).toHaveBeenCalledWith(payload, { expiresIn: '1h' });
    expect(token).toBe('accessToken');
  });

  it('주어진 payload로, refresh 토큰을 생성하면, 30일 유효기간의 토큰을 반환한다', () => {
    // Given
    const payload = { userId: 1 };
    mockNestJwtService.sign = jest.fn().mockReturnValue('refreshToken');

    // When
    const token = jwtService.generateRefreshToken(payload);

    // Then
    expect(mockNestJwtService.sign).toHaveBeenCalledWith(payload, { expiresIn: '30d' });
    expect(token).toBe('refreshToken');
  });

  it('주어진 access 토큰이, 유효하면, payload를 반환한다', () => {
    // Given
    const token = 'validAccessToken';
    const decodedPayload = { userId: 1 };
    mockNestJwtService.verify = jest.fn().mockReturnValue(decodedPayload);

    // When
    const payload = jwtService.verifyAccessToken(token);

    // Then
    expect(mockNestJwtService.verify).toHaveBeenCalledWith(token);
    expect(payload).toEqual(decodedPayload);
  });

  it('주어진 refresh 토큰이, 유효하면, payload를 반환한다', () => {
    // Given
    const token = 'validRefreshToken';
    const decodedPayload = { userId: 1 };
    mockNestJwtService.verify = jest.fn().mockReturnValue(decodedPayload);

    // When
    const payload = jwtService.cerifyRefreshToken(token);

    // Then
    expect(mockNestJwtService.verify).toHaveBeenCalledWith(token);
    expect(payload).toEqual(decodedPayload);
  });
});
