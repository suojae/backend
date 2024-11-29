import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './application/auth.service';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { ExternalAuthService } from './infrastructure/api-services/external-auth.service';
import { JwtService } from './infrastructure/util-services/jwt.service';
import { BcryptService } from './infrastructure/util-services/bcryptService';
import { KakaoAuthService } from './infrastructure/api-services/kakao-auth.service';
import { AppleAuthService } from './infrastructure/api-services/apple-auth.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDAO } from './infrastructure/dao/user.dao';
import { RedisService } from './infrastructure/db-services/redis.service';
import { MySQLService } from './infrastructure/db-services/mysql.service';
import { IUserRepository } from './domain/user.repository.interface';
import { IAuthRepository } from './domain/auth.repository.interface';

@Module({
  controllers: [AuthController],
  exports: [AuthService, RedisService, MySQLService],
  providers: [
    AuthService,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
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
})
export class AuthModule {}
