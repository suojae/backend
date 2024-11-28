import { RedisService } from '../../../src/auth/infrastructure/db-services/redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

describe('RedisService', () => {
  let redisService: RedisService;
  let cacheManager: Cache;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('Redis에 데이터가 존재할 때, 해당 키로 조회하면, 캐시 데이터를 반환한다', async () => {
    // Given
    const key = 'testKey';
    const value = 'testValue';
    jest.spyOn(cacheManager, 'get').mockResolvedValue(value);

    // When
    const result = await redisService.get<string>(key);

    // Then
    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(result).toBe(value);
  });

  it('캐시에 데이터가 없을 때, 데이터를 조회하면, null을 반환한다', async () => {
    // Given
    const key = 'nonExistingKey';
    jest.spyOn(cacheManager, 'get').mockResolvedValue(null);

    // When
    const result = await redisService.get<string>(key);

    // Then
    expect(cacheManager.get).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('키-값-ttl을 제공할 때, 데이터를 저장하면, TTL값과 함께 캐시에 값이 추가된다', async () => {
    // Given
    const key = 'testKey';
    const value = 'testValue';
    const ttl = 60; // 60초
    jest.spyOn(cacheManager, 'set').mockResolvedValue(undefined);

    // When
    await redisService.set<string>(key, value, ttl);

    // Then
    expect(cacheManager.set).toHaveBeenCalledWith(key, value, ttl);
  });

  it('캐시에 데이터가 있을 때, 데이터를 삭제하면, 해당 데이터가 제거된다', async () => {
    // Given
    const key = 'testKey';
    jest.spyOn(cacheManager, 'del').mockResolvedValue(undefined);

    // When
    await redisService.del(key);

    // Then
    expect(cacheManager.del).toHaveBeenCalledWith(key);
  });
});
