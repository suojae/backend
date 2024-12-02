import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { IAuthRepository } from '../domain/auth.repository.interface';
import { IUserRepository } from '../domain/user.repository.interface';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SocialProvider } from '../domain/social-provider.type';
import { Animal } from '../domain/user.entity';
import { SocialLoginResponseDto } from './dto/social-login-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { TokenRefreshRequestDto } from './dto/token-refresh-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';
import { WithdrawResponseDto } from './dto/withdraw-response.dto';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async signup(dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const { nickname, characterId, termsAgreed, socialProvider, authCode } =
      dto;

    if (!termsAgreed) {
      throw new BadRequestException('약관에 동의해야 합니다.');
    }

    // 소셜 인증 및 사용자 등록 또는 조회
    const userUuid = await this.authRepository.registerUser(
      socialProvider as SocialProvider,
      authCode,
    );

    const user = await this.userRepository.findById(userUuid);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.nickname = nickname;
    user.themeAnimal = characterId as Animal;

    await this.userRepository.save(user);

    const response: SignUpResponseDto = {
      uuid: user.id,
      nickname: user.nickname,
      characterId: user.themeAnimal,
      socialProvider: user.socialProvider,
    };

    return response;
  }

  async login(dto: SocialLoginRequestDto): Promise<SocialLoginResponseDto> {
    const { socialProvider, authCode } = dto;

    // 소셜 인증 및 사용자 등록 또는 조회
    const userUuid = await this.authRepository.registerUser(
      socialProvider as SocialProvider,
      authCode,
    );

    // 토큰 발급
    const { accessToken, refreshToken } =
      await this.authRepository.authenticateSocial(
        userUuid,
        socialProvider as SocialProvider,
        authCode,
      );

    // 신규 사용자 여부 판단
    const user = await this.userRepository.findById(userUuid);
    const isNewUser = !user.nickname; // 닉네임이 없으면 신규 사용자로 간주

    return {
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  async refreshTokens(
    dto: TokenRefreshRequestDto,
  ): Promise<TokenRefreshResponseDto> {
    const { accessToken, refreshToken } = dto;

    // Access Token에서 사용자 정보 추출
    const payload = await this.authRepository.validateAccessToken(accessToken);
    const userUuid = payload.userUuid;

    // 토큰 재발급
    const tokens = await this.authRepository.reissueTokens(
      userUuid,
      refreshToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    const { accessToken, refreshToken } = dto;

    // Access Token에서 사용자 정보 추출
    const payload = await this.authRepository.validateAccessToken(accessToken);
    const userUuid = payload.userUuid;

    // 로그아웃 처리
    await this.authRepository.logout(userUuid, accessToken, refreshToken);

    return {
      success: true,
      message: '로그아웃이 완료되었습니다.',
    };
  }

  async withdraw(dto: WithdrawRequestDto): Promise<WithdrawResponseDto> {
    const { accessToken } = dto;

    // Access Token에서 사용자 정보 추출
    const payload = await this.authRepository.validateAccessToken(accessToken);
    const userUuid = payload.userUuid;

    // 사용자 조회
    const user = await this.userRepository.findById(userUuid);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 회원탈퇴 처리
    await this.authRepository.withdraw(userUuid, user.socialProvider);

    return {
      success: true,
      message: '회원탈퇴가 완료되었습니다.',
    };
  }
}
