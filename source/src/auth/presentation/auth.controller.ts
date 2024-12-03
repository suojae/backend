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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth') // Swagger에서 'auth' 태그로 묶을 수 있습니다.
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: SignUpRequestDto }) // 요청 DTO 문서화
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
    type: SignUpResponseDto, // 응답 DTO 문서화
  })
  async signup(@Body() dto: SignUpRequestDto): Promise<SignUpResponseDto> {
    console.log(dto); // 디버깅 로그 추가
    return await this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '소셜 로그인' })
  @ApiBody({ type: SocialLoginRequestDto }) // 요청 DTO 문서화
  @ApiResponse({
    status: 200,
    description: '소셜 로그인 성공',
    type: SocialLoginResponseDto, // 응답 DTO 문서화
  })
  async login(
    @Body() dto: SocialLoginRequestDto,
  ): Promise<SocialLoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh-tokens')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiBody({ type: TokenRefreshRequestDto }) // 요청 DTO 문서화
  @ApiResponse({
    status: 200,
    description: '토큰 재발급 성공',
    type: TokenRefreshResponseDto, // 응답 DTO 문서화
  })
  async refreshTokens(
    @Body() dto: TokenRefreshRequestDto,
  ): Promise<TokenRefreshResponseDto> {
    return await this.authService.refreshTokens(dto);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiBody({ type: LogoutRequestDto }) // 요청 DTO 문서화
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: LogoutResponseDto, // 응답 DTO 문서화
  })
  async logout(@Body() dto: LogoutRequestDto): Promise<LogoutResponseDto> {
    return await this.authService.logout(dto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBody({ type: WithdrawRequestDto }) // 요청 DTO 문서화
  @ApiResponse({
    status: 200,
    description: '회원탈퇴 성공',
    type: WithdrawResponseDto, // 응답 DTO 문서화
  })
  async withdraw(
    @Body() dto: WithdrawRequestDto,
  ): Promise<WithdrawResponseDto> {
    return await this.authService.withdraw(dto);
  }
}
