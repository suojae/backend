import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {FindOptionsWhere, Repository} from 'typeorm';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class MySQLService<T> {
    constructor(private readonly repository: Repository<T>) {
    }

    /**
     * ID로 데이터를 조회합니다.
     * @param id 데이터의 ID
     * @returns 데이터 또는 null
     * @throws InternalServerErrorException 데이터 조회 중 오류 발생 시
     */
    async findById(id: string): Promise<T | null> {
        try {
            return await this.repository.findOneBy({uuid: id} as any);
        } catch {
            throw new InternalServerErrorException(
                '데이터 조회 중 오류가 발생했습니다.',
            );
        }
    }

    /**
     * 조건에 따라 단일 데이터를 조회합니다.
     * @param where 조건 필드
     * @returns 데이터 또는 null
     * @throws InternalServerErrorException 데이터 조회 중 오류 발생 시
     */
    async findOneByFields(where: FindOptionsWhere<T>): Promise<T | null> {
        try {
            return await this.repository.findOne({where});
        } catch {
            throw new InternalServerErrorException(
                '데이터 조회 중 오류가 발생했습니다.',
            );
        }
    }

    /**
     * 데이터를 저장합니다.
     * @param entity 저장할 엔티티
     * @returns 저장된 엔티티
     * @throws InternalServerErrorException 데이터 저장 중 오류 발생 시
     */
    async save(entity: T): Promise<T> {
        try {
            return await this.repository.save(entity);
        } catch {
            throw new InternalServerErrorException(
                '데이터 저장 중 오류가 발생했습니다.',
            );
        }
    }

    /**
     * 데이터를 업데이트합니다.
     * @param id 업데이트할 데이터의 ID
     * @param entity 업데이트할 데이터
     * @throws InternalServerErrorException 데이터 업데이트 중 오류 발생 시
     */
    async update(id: string, entity: QueryDeepPartialEntity<T>): Promise<void> {
        try {
            await this.repository.update(id, entity);
        } catch {
            throw new InternalServerErrorException(
                '데이터 업데이트 중 오류가 발생했습니다.',
            );
        }
    }

    /**
     * 데이터를 삭제합니다.
     * @param id 삭제할 데이터의 ID
     * @throws InternalServerErrorException 데이터 삭제 중 오류 발생 시
     */
    async delete(id: string): Promise<void> {
        try {
            await this.repository.delete(id as any);
        } catch {
            throw new InternalServerErrorException(
                '데이터 삭제 중 오류가 발생했습니다.',
            );
        }
    }
}
