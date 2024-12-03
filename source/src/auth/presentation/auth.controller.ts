import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import { SocialLoginResponseDto } from './dto/social-login-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { TokenRefreshRequestDto } from './dto/token-refresh-request.dto';
import { TokenRefreshResponseDto } from './dto/token-refresh-response.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { LogoutRequestDto } from './dto/logout-request.dto';
import { WithdrawRequestDto } from './dto/withdraw-request.dto';
import { WithdrawResponseDto } from './dto/withdraw-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignUpRequestDto })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    type: SignUpResponseDto,
  })
  async signup(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    return await this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiBody({ type: SocialLoginRequestDto })
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공',
    type: SocialLoginResponseDto,
  })
  async login(
    @Body() dto: SocialLoginRequestDto,
  ): Promise<SocialLoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh-tokens')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBody({ type: TokenRefreshRequestDto })
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    type: TokenRefreshResponseDto,
  })
  async refreshTokens(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<TokenRefreshResponseDto> {
    return await this.authService.refreshTokens(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({ type: LogoutRequestDto })
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto,
  })
  async logout(@Body() dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    return await this.authService.logout(dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBody({ type: WithdrawRequestDto })
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 성공',
    type: WithdrawResponseDto,
  })
  async withdraw(
    @Body() dto: WithdrawRequestDto,
  ): Promise<WithdrawResponseDto> {
    return await this.authService.withdraw(dto);
  }
}
