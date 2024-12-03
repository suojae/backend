import { ConfigService } from '@nestjs/config';

export const redisConfig = (configService: ConfigService) => ({
  store: 'redis',
  socket: {
    host: configService.get<string>('REDIS_HOST', 'localhost'),
    port: configService.get<number>('REDIS_PORT', 6379),
  },
  ttl: Math.max(configService.get<number>('CACHE_TTL', 600), 1), // TTL 최소값 보장
});
