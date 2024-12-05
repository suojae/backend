import {BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {JwtService as NestJwtService} from '@nestjs/jwt';

@Injectable()
export class JwtService {
    constructor(private readonly jwtService: NestJwtService) {
    }

    /**
     * Access Token 생성
     * 주어진 페이로드(payload)를 사용하여 1시간 동안 유효한 Access Token을 생성합니다.
     * @param payload JWT 토큰에 포함될 데이터 (예: 사용자 ID, 권한 등)
     * @returns 생성된 Access Token (string)
     * @throws InternalServerErrorException 토큰 생성 중 문제가 발생한 경우
     */
    generateAccessToken(payload: JwtPayload): string {
        try {
            // JWT Access Token 생성
            return this.jwtService.sign(payload, { expiresIn: '1h' });
        } catch {
            // 예외 발생 시 처리
            throw new InternalServerErrorException('Access Token 생성 중 오류가 발생했습니다.');
        }
    }

    /**
     * Refresh Token 생성
     * 주어진 페이로드(payload)를 사용하여 30일 동안 유효한 Refresh Token을 생성합니다.
     * @param payload JWT 토큰에 포함될 데이터 (예: 사용자 ID, 권한 등)
     * @returns 생성된 Refresh Token (string)
     * @throws InternalServerErrorException 토큰 생성 중 문제가 발생한 경우
     */
    generateRefreshToken(payload: JwtPayload): string {
        try {
            // JWT Refresh Token 생성
            return this.jwtService.sign(payload, { expiresIn: '30d' });
        } catch {
            // 예외 발생 시 처리
            throw new InternalServerErrorException('Refresh Token 생성 중 오류가 발생했습니다.');
        }
    }

    /**
     * Access Token 검증
     * 주어진 Access Token의 유효성을 검증하고 페이로드를 반환합니다
     * @param token 검증할 Access Token
     * @returns 토큰에 포함된 페이로드
     * @throws 토큰이 유효하지 않거나 만료된 경우 예외 발생
     */
    verifyAccessToken(token: string): JwtPayload {
        try {
            return this.jwtService.verify(token);
        } catch {
            throw new UnauthorizedException('Access Token이 유효하지 않습니다.');
        }
    }

    /**
     * Refresh Token 검증
     * 주어진 Refresh Token의 유효성을 검증하고 페이로드를 반환합니다
     * @param token 검증할 Refresh Token
     * @returns 토큰에 포함된 페이로드
     * @throws 토큰이 유효하지 않거나 만료된 경우 예외 발생
     */
    verifyRefreshToken(token: string): JwtPayload {
        try {
            return this.jwtService.verify(token);
        } catch {
            throw new UnauthorizedException('Refresh Token이 유효하지 않습니다');
        }
    }

    /**
     * Refresh Token의 만료 시간을 반환합니다.
     * @param token 검증할 Refresh Token
     * @returns 만료 시간 (Date 객체)
     * @throws BadRequestException 토큰이 잘못되었거나 만료 시간이 없는 경우
     */
    getRefreshTokenExpirationDate(token: string): Date {
        try {
            // Step 1: 토큰 디코딩
            const decoded = this.jwtService.decode(token) as any;

            // Step 2: 디코딩 결과 유효성 확인
            if (!decoded || !decoded.exp) {
                throw new BadRequestException('토큰이 유효하지 않거나 만료 시간을 포함하지 않습니다.');
            }

            // Step 3: 만료 시간을 초 단위에서 밀리초 단위로 변환하여 Date 객체 생성
            return new Date(decoded.exp * 1000);
        } catch {
            throw new BadRequestException('Refresh Token 처리 중 오류가 발생했습니다.');
        }
    }
}

export interface JwtPayload {
    userId: string;
    roles: string[];
}

