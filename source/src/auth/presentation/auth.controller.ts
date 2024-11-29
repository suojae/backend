import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthDto } from '../application/dto/auth.dto';
import { AuthService } from '../application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 카카오 인증
   */
  @Post('kakao')
  @HttpCode(HttpStatus.OK)
  async authenticateWithKakao(
    @Body() authDto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.authenticateWithKakao(authDto);
  }

  /**
   * 애플 인증
   */
  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async authenticateWithApple(
    @Body() authDto: AuthDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.authenticateWithApple(authDto);
  }

  /**
   * 토큰 재발급
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async reissueTokens(
    @Body() body: { userUuid: string; refreshToken: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { userUuid, refreshToken } = body;
    return await this.authService.reissueTokens(userUuid, refreshToken);
  }
}
