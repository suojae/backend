import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  /**
   * Access Token 생성
   * 주어진 페이로드(payload)를 사용하여 1시간 동안 유효한 Access Token을 생성합니다
   * @param payload JWT 토큰에 포함될 데이터 (예: 사용자 ID, 권한 등)
   * @returns 생성된 Access Token (string)
   */
  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  /**
   * Refresh Token 생성
   * 주어진 페이로드(payload)를 사용하여 30일 동안 유효한 Refresh Token을 생성합니다
   * @param payload JWT 토큰에 포함될 데이터
   * @returns 생성된 Refresh Token (string)
   */
  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  /**
   * Access Token 검증
   * 주어진 Access Token의 유효성을 검증하고 페이로드를 반환합니다
   * @param token 검증할 Access Token
   * @returns 토큰에 포함된 페이로드 (any)
   * @throws 토큰이 유효하지 않거나 만료된 경우 예외 발생
   */
  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * Refresh Token 검증
   * 주어진 Refresh Token의 유효성을 검증하고 페이로드를 반환합니다
   * @param token 검증할 Refresh Token
   * @returns 토큰에 포함된 페이로드 (any)
   * @throws 토큰이 유효하지 않거나 만료된 경우 예외 발생
   */
  verifyRefreshToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
