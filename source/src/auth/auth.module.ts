import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { ExternalAuthService } from './infrastructure/external-services/external-auth.service';
import { JwtService } from './infrastructure/services/jwt.service';
import { BcryptService } from './infrastructure/services/bcryptService';
import { KakaoAuthService } from './infrastructure/external-services/kakao-auth.service';
import { AppleAuthService } from './infrastructure/external-services/apple-auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDAO } from './infrastructure/dao/user.dao';
import { RedisService } from './infrastructure/data-services/redis.service';
import { MySQLService } from './infrastructure/data-services/mysql.service';
import { UserEntity } from './domain/user.entity';

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
    RedisService,
    MySQLService,
  ],
  exports: [AuthService, RedisService, MySQLService],
})
export class AuthModule {}
