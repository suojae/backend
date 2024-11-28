import { Test, TestingModule } from '@nestjs/testing';
import { CacheAsideService } from '../../../src/auth/infrastructure/db-services/cache-aside.service';
import { RedisService } from '../../../src/auth/infrastructure/db-services/redis.service';
import { MySQLService } from '../../../src/auth/infrastructure/db-services/mysql.service';

describe('CacheAsideService', () => {
  let cacheAsideService: CacheAsideService<any>;
  let redisService: RedisService;
  let mysqlService: MySQLService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheAsideService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        {
          provide: MySQLService,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    cacheAsideService = module.get<CacheAsideService<any>>(CacheAsideService);
    redisService = module.get<RedisService>(RedisService);
    mysqlService = module.get<MySQLService<any>>(MySQLService);
  });

  describe('getData', () => {
    it('캐시에 데이터가 있을 때, 데이터를 조회하면, 캐시에서 데이터를 반환한다.', async () => {
      // Given
      const key = 'test-key';
      const cachedData = { id: 1, name: 'Cached Data' };
      jest.spyOn(redisService, 'get').mockResolvedValue(cachedData);

      // When
      const result = await cacheAsideService.getData(key, 1);

      // Then
      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(cachedData);
    });

    it('캐시에 데이터가 없고 DB에 데이터가 있을 때, 데이터를 조회하면, DB에서 데이터를 가져오고 캐시에 저장한다.', async () => {
      // Given
      const key = 'test-key';
      const dbData = { id: 1, name: 'DB Data' };
      jest.spyOn(redisService, 'get').mockResolvedValue(null);
      jest.spyOn(mysqlService, 'findById').mockResolvedValue(dbData);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      const result = await cacheAsideService.getData(key, 1);

      // Then
      expect(redisService.get).toHaveBeenCalledWith(key);
      expect(mysqlService.findById).toHaveBeenCalledWith(1);
      expect(redisService.set).toHaveBeenCalledWith(key, dbData, 3600);
      expect(result).toEqual(dbData);
    });
  });

  describe('saveData', () => {
    it('새로운 데이터를 저장할 때, 데이터를 저장하면, DB에 저장하고 캐시를 갱신한다.', async () => {
      // Given
      const key = 'test-key';
      const entity = { name: 'New Entity' };
      const savedData = { id: 1, name: 'New Entity' };
      jest.spyOn(mysqlService, 'save').mockResolvedValue(savedData);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      const result = await cacheAsideService.saveData(key, entity);

      // Then
      expect(mysqlService.save).toHaveBeenCalledWith(entity);
      expect(redisService.set).toHaveBeenCalledWith(key, savedData, 3600);
      expect(result).toEqual(savedData);
    });
  });

  describe('updateData', () => {
    it('데이터를 업데이트할 때, 데이터를 업데이트하면, DB를 수정하고 캐시를 갱신한다.', async () => {
      // Given
      const key = 'test-key';
      const id = 1;
      const updateEntity = { name: 'Updated Entity' };
      const updatedData = { id: 1, name: 'Updated Entity' };
      jest.spyOn(mysqlService, 'update').mockResolvedValue(undefined);
      jest.spyOn(mysqlService, 'findById').mockResolvedValue(updatedData);
      jest.spyOn(redisService, 'set').mockResolvedValue(undefined);

      // When
      await cacheAsideService.updateData(key, id, updateEntity);

      // Then
      expect(mysqlService.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining(updateEntity),
      );
      expect(mysqlService.findById).toHaveBeenCalledWith(id);
      expect(redisService.set).toHaveBeenCalledWith(key, updatedData, 3600);
    });
  });

  describe('deleteData', () => {
    it('데이터를 삭제할 때, 데이터를 삭제하면, DB에서 삭제하고 캐시를 제거한다.', async () => {
      // Given
      const key = 'test-key';
      const id = 1;
      jest.spyOn(mysqlService, 'delete').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'del').mockResolvedValue(undefined);

      // When
      await cacheAsideService.deleteData(key, id);

      // Then
      expect(mysqlService.delete).toHaveBeenCalledWith(id);
      expect(redisService.del).toHaveBeenCalledWith(key);
    });
  });
});
