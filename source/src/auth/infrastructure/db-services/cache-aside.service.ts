import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { MySQLService } from './mysql.service';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CacheAsideService<T> {
  constructor(
    private readonly redisService: RedisService,
    private readonly mysqlService: MySQLService<T>,
  ) {}

  /**
   * cache-aside 패턴을 사용하여 데이터 조회
   * @param key 캐시 키
   * @param id 데이터베이스ID
   * @returns 데이터 또는 null
   */
  async getData(key: string, id: number): Promise<T | null> {
    const cachedData = await this.redisService.get<T>(key);
    if (cachedData) {
      return cachedData; // 캐시 히트
    }

    const dbData = await this.mysqlService.findById(id);
    if (dbData) {
      await this.redisService.set(key, dbData, 3600); // TTL 1시간
    }
    return dbData;
  }

  /**
   * 데이터를 저장하고 캐시를 업데이트 합니다.
   * @param key 캐시 키
   * @param entity 저장할 엔티티
   * @returns 저장된 엔티티
   */
  async saveData(key: string, entity: T): Promise<T> {
    const savedData = await this.mysqlService.save(entity);
    await this.redisService.set(key, savedData, 3600);
    return savedData;
  }

  /**
   * 데이터를 업데이트하고 캐시를 갱신합니다
   * @param key 캐시 키
   * @param id 업데이트할 데이터의 ID
   * @param entity entity 업데이트할 데이터
   */
  async updateData(key: string, id: number, entity: Partial<T>): Promise<void> {
    await this.mysqlService.update(id, entity as QueryDeepPartialEntity<T>);
    const updatedData = await this.mysqlService.findById(id);
    if (updatedData) {
      await this.redisService.set(key, updatedData, 3600);
    }
  }

  /**
   * 데이터를 삭제하고 캐시를 제거합니다.
   * @param key 캐시 키
   * @param id 삭제할 데이터의 ID
   */
  async deleteData(key: string, id: number): Promise<void> {
    await this.mysqlService.delete(id);
    await this.redisService.del(key);
  }
}
