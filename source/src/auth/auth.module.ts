import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { ExternalAuthService } from './infrastructure/external-service/external-auth.service';
import { JwtService } from './infrastructure/services/jwt.service';
import { BcryptService } from './infrastructure/services/bcryptService';
import { KakaoAuthService } from './infrastructure/external-service/kakao-auth.service';
import { AppleAuthService } from './infrastructure/external-service/apple-auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDAO } from './infrastructure/dao/user.dao';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    ExternalAuthService,
    AuthRepository,
    UserRepository,
    JwtService,
    BcryptService,
    KakaoAuthService,
    AppleAuthService,
    UserDAO,
  ],
})
export class AuthModule {}
