import { Injectable } from '@nestjs/common';
import { CacheAsideService } from '../db-services/cache-aside.service';
import { UserDAO } from '../dao/user.dao';
import { BcryptService } from '../util-services/bcryptService';
import { UserEntity } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly cacheAsideService: CacheAsideService<UserDAO>,
    private readonly bcryptService: BcryptService,
  ) {}

  /**
   * 사용자 데이터를 저장합니다.
   * @param userEntity 저장할 사용자 엔티티
   * @returns 저장된 사용자 엔티티
   */
  async save(userEntity: UserEntity): Promise<UserEntity> {
    // 1. 비밀번호 해싱
    const hashedPassword = await this.bcryptService.hashPassword(
      userEntity.password,
    );

    // 2. Entity를 DAO로 변환
    const userDAO = userEntity.toDAO(hashedPassword);

    // 3. DAO 저장
    const savedDAO = await this.cacheAsideService.saveData(
      `user:${userDAO.uuid}`,
      userDAO,
    );

    // 4. DAO를 다시 Entity로 변환하여 반환
    return UserEntity.fromDAO(savedDAO);
  }

  /**
   * 사용자 UUID로 사용자 데이터를 조회합니다.
   * @param uuid 사용자 UUID
   * @returns 사용자 엔티티 또는 null
   */
  async findById(uuid: string): Promise<UserEntity | null> {
    const dao = await this.cacheAsideService.getData(
      `user:${uuid}`,
      uuid as any,
    );
    return dao ? UserEntity.fromDAO(dao) : null;
  }

  /**
   * 사용자 데이터를 업데이트합니다.
   * @param uuid 업데이트할 사용자 UUID
   * @param partialUser 업데이트할 필드
   */
  async update(uuid: string, partialUser: Partial<UserEntity>): Promise<void> {
    const currentDAO = await this.cacheAsideService.getData(
      `user:${uuid}`,
      uuid as any,
    );
    if (!currentDAO) {
      throw new Error('User not found');
    }

    // Entity로 변환하여 업데이트
    const updatedEntity = UserEntity.fromDAO(currentDAO);
    Object.assign(updatedEntity, partialUser);

    // 업데이트된 Entity를 DAO로 변환하여 저장
    const updatedDAO = updatedEntity.toDAO(currentDAO.hashed_password);
    await this.cacheAsideService.updateData(
      `user:${uuid}`,
      uuid as any,
      updatedDAO,
    );
  }

  /**
   * 사용자 데이터를 삭제합니다.
   * @param uuid 삭제할 사용자 UUID
   */
  async delete(uuid: string): Promise<void> {
    await this.cacheAsideService.deleteData(`user:${uuid}`, uuid as any);
  }
}
