import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AuthTokenDAO } from './infrastructure/dao/auth-token.dao';
import { UserDAO } from './infrastructure/dao/user.dao';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './presentation/auth.service';
import { AuthRepository } from './infrastructure/repositories/auth.repository';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { ExternalAuthService } from './infrastructure/api-services/external-auth.service';
import { AppleAuthService } from './infrastructure/api-services/apple-auth.service';
import { KakaoAuthService } from './infrastructure/api-services/kakao-auth.service';
import { BcryptService } from './infrastructure/util-services/bcryptService';
import { CacheAsideService } from './infrastructure/db-services/cache-aside.service';
import { RedisService } from './infrastructure/db-services/redis.service';
import { MySQLService } from './infrastructure/db-services/mysql.service';
import { Repository } from 'typeorm';
import { JwtService } from './infrastructure/util-services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'node:process';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisConfig } from '../config/redis.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return redisConfig(configService);
      },
    }),

    // Importing TypeORM entities
    TypeOrmModule.forFeature([UserDAO, AuthTokenDAO]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Repositories
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    // External Authentication Services
    ExternalAuthService,
    AppleAuthService,
    KakaoAuthService,
    // Utility Services
    JwtService,
    BcryptService,
    // Database Services
    {
      provide: CacheAsideService,
      useFactory: (
        redisService: RedisService,
        mysqlService: MySQLService<AuthTokenDAO>,
      ) => new CacheAsideService<AuthTokenDAO>(redisService, mysqlService),
      inject: [RedisService, MySQLService],
    },
    {
      provide: MySQLService,
      useFactory: (repository: Repository<UserDAO>) =>
        new MySQLService<UserDAO>(repository),
      inject: ['UserDAORepository'],
    },
    RedisService,
  ],
})
export class AuthModule {}
