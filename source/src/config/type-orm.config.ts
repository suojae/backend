import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DATABASE_HOST', 'localhost'),
    port: configService.get<number>('DATABASE_PORT', 3306),
    username: configService.get<string>('DATABASE_USERNAME', 'root'),
    password: configService.get<string>('DATABASE_PASSWORD', ''),
    database: configService.get<string>('DATABASE_DATABASE', 'test'),
    entities: [__dirname + '/../**/*.dao{.ts,.js}'], // 엔티티 경로 확인
    synchronize: configService.get<boolean>('TYPEORM_SYNC', false), // 동기화 여부
    autoLoadEntities: true, // NestJS에서 엔티티 자동 로드 (옵션)
    logging: configService.get<boolean>('TYPEORM_LOGGING', true), // 로깅 설정 (옵션)
  };
};
