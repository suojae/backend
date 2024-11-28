import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Redis에서 값을 가져옵니다
   * @param key 캐시 키
   * @returns 캐시된 값 또는 null (값이 없을 경우)
   */
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get(key);
  }

  /**
   * Redis에 값을 설정합니다
   * @param key 캐시키
   * @param value 저장할 값
   * @param ttl 캐시 유효시간(초 단위, 옵션)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Redis에서 특정 키의 값을 삭제합니다
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
