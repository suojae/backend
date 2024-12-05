import {Inject, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    }

    /**
     * Redis에서 값을 가져옵니다.
     * @param key 캐시 키
     * @returns 캐시된 값 또는 null (값이 없을 경우)
     * @throws InternalServerErrorException Redis에서 값을 가져오는 중 오류 발생 시
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            return await this.cacheManager.get<T>(key);
        } catch {
            throw new InternalServerErrorException(
                `Redis에서 키 "${key}"를 가져오는 중 오류가 발생했습니다.`,
            );
        }
    }

    /**
     * Redis에 값을 설정합니다.
     * @param key 캐시키
     * @param value 저장할 값
     * @param ttl 캐시 유효시간(초 단위, 옵션)
     * @throws InternalServerErrorException Redis에 값을 설정하는 중 오류 발생 시
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            await this.cacheManager.set(key, value, ttl);
        } catch {
            throw new InternalServerErrorException(
                `Redis에 키 "${key}"를 설정하는 중 오류가 발생했습니다.`,
            );
        }
    }

    /**
     * Redis에서 특정 키의 값을 삭제합니다.
     * @param key 삭제할 캐시 키
     * @throws InternalServerErrorException Redis에서 값을 삭제하는 중 오류 발생 시
     */
    async del(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
        } catch {
            throw new InternalServerErrorException(
                `Redis에서 키 "${key}"를 삭제하는 중 오류가 발생했습니다.`,
            );
        }
    }
}
