import { Inject, Injectable } from '@nestjs/common';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { IUserRepository } from '../domain/user.repository.interface';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  /**
   * 카카오 인증 처리
   */
  async authenticateWithKakao(
    authDto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userUuid, authCode } = authDto;

    // AuthRepository를 통해 카카오 인증 수행
    return await this.authRepository.authenticateKakao(userUuid, authCode);
  }

  /**
   * 애플 인증 처리
   */
  async authenticateWithApple(
    authDto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userUuid, authCode } = authDto;

    // AuthRepository를 통해 애플 인증 수행
    return await this.authRepository.authenticateApple(userUuid, authCode);
  }

  /**
   * 토큰 재발급 처리
   */
  async reissueTokens(
    userUuid: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authRepository.reissueTokens(userUuid, refreshToken);
  }
}
