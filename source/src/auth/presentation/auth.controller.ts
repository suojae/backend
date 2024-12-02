import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { SignUpResponseDto } from '../application/dto/sign-up-response.dto';
import { SignUpRequestDto } from '../application/dto/sign-up-request.dto';
import { SocialLoginResponseDto } from '../application/dto/social-login-response.dto';
import { SocialLoginRequestDto } from '../application/dto/social-login-request.dto';
import { TokenRefreshRequestDto } from '../application/dto/token-refresh-request.dto';
import { TokenRefreshResponseDto } from '../application/dto/token-refresh-response.dto';
import { LogoutResponseDto } from '../application/dto/logout-response.dto';
import { LogoutRequestDto } from '../application/dto/logout-request.dto';
import { WithdrawRequestDto } from '../application/dto/withdraw-request.dto';
import { WithdrawResponseDto } from '../application/dto/withdraw-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입 API
   * @param dto 회원가입 요청 DTO
   * @returns 회원가입 응답 DTO
   */
  @Post('signup')
  async signup(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    console.log(dto); // 디버깅 로그 추가
    return await this.authService.signup(dto);
  }

  /**
   * 로그인 API
   * @param dto 소셜 로그인 요청 DTO
   * @returns 소셜 로그인 응답 DTO
   */
  @Post('login')
  async login(
    @Body() dto: SocialLoginRequestDto,
  ): Promise<SocialLoginResponseDto> {
    return await this.authService.login(dto);
  }

  /**
   * 토큰 재발급 API
   * @param dto 토큰 재발급 요청 DTO
   * @returns 토큰 재발급 응답 DTO
   */
  @Post('refresh-tokens')
  async refreshTokens(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<TokenRefreshResponseDto> {
    return await this.authService.refreshTokens(dto);
  }

  /**
   * 로그아웃 API
   * @param dto 로그아웃 요청 DTO
   * @returns 로그아웃 응답 DTO
   */
  @Post('logout')
  async logout(@Body() dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    return await this.authService.logout(dto);
  }

  /**
   * 회원탈퇴 API
   * @param dto 회원탈퇴 요청 DTO
   * @returns 회원탈퇴 응답 DTO
   */
  @Post('withdraw')
  async withdraw(
    @Body() dto: WithdrawRequestDto,
  ): Promise<WithdrawResponseDto> {
    return await this.authService.withdraw(dto);
  }
}
