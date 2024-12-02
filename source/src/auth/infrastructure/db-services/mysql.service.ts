import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MySQLService<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * ID로 데이터를 조회합니다.
   * @param id 데이터의 ID
   * @returns 데이터 또는 null
   */
  async findById(id: string): Promise<T | null> {
    return this.repository.findOne(id as any);
  }

  /**
   * 조건에 따라 단일 데이터를 조회합니다.
   * @param where 조건 필드
   * @returns 데이터 또는 null
   */
  async findOneByFields(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where });
  }

  /**
   * 데이터를 저장합니다.
   * @param entity 저장할 엔티티
   * @returns 저장된 엔티티
   */
  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  /**
   * 데이터를 업데이트합니다.
   * @param id 업데이트할 데이터의 ID
   * @param entity 업데이트할 데이터
   */
  async update(id: string, entity: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repository.update(id, entity);
  }

  /**
   * 데이터를 삭제합니다.
   * @param id 삭제할 데이터의 ID
   */
  async delete(id: string): Promise<void> {
    await this.repository.delete(id as any);
  }
}
