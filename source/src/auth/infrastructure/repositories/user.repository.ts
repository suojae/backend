import { Injectable } from '@nestjs/common';
import { UserDAO } from '../dao/user.dao';
import { MySQLService } from '../db-services/mysql.service';
import { RedisService } from '../db-services/redis.service';
import { BcryptService } from '../util-services/bcryptService';
import { UserEntity } from '../../domain/user.entity';
import { SocialProvider } from '../../domain/social-provider.type';
import { IUserRepository } from '../../domain/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly mysqlService: MySQLService<UserDAO>,
    private readonly redisService: RedisService,
    private readonly bcryptService: BcryptService,
  ) {}

  /**
   * 사용자 데이터를 저장합니다.
   * @param userEntity 저장할 사용자 엔티티
   * @returns 저장된 사용자 엔티티
   */
  async save(userEntity: UserEntity): Promise<UserEntity> {
    let hashedPassword = undefined;
    if (userEntity.password) {
      hashedPassword = await this.bcryptService.hashPassword(
        userEntity.password,
      );
    }

    const userDAO = userEntity.toDAO(hashedPassword);
    const savedDAO = await this.mysqlService.save(userDAO);
    const cacheKey = this.getCacheKey(savedDAO.uuid);

    await this.redisService.set(cacheKey, savedDAO);
    return UserEntity.fromDAO(savedDAO);
  }

  /**
   * 사용자 UUID로 사용자 데이터를 조회합니다.
   * @param uuid 사용자 UUID
   * @returns 사용자 엔티티 또는 null
   */
  async findById(uuid: string): Promise<UserEntity | null> {
    const cacheKey = this.getCacheKey(uuid);

    const cachedDAO = await this.redisService.get<UserDAO>(cacheKey);
    if (cachedDAO) {
      return UserEntity.fromDAO(cachedDAO);
    }

    const userDAO = await this.mysqlService.findById(uuid);
    if (!userDAO) {
      return null;
    }

    await this.redisService.set(cacheKey, userDAO);
    return UserEntity.fromDAO(userDAO);
  }

  /**
   * 소셜 ID로 사용자 조회
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param socialId 소셜 제공자에서의 사용자 ID
   * @returns 사용자 엔티티 또는 null
   */
  async findBySocialId(
    socialProvider: SocialProvider,
    socialId: string,
  ): Promise<UserEntity | null> {
    const userDAO = await this.mysqlService.findOneByFields({
      social_provider: socialProvider,
      social_id: socialId,
    });

    return userDAO ? UserEntity.fromDAO(userDAO) : null;
  }

  /**
   * 소셜 ID로 사용자 생성
   * @param uuid 사용자 UUID
   * @param socialProvider 소셜 제공자 ('apple' 또는 'kakao')
   * @param socialId 소셜 제공자에서의 사용자 ID
   * @returns 생성된 사용자 엔티티
   */
  async createWithSocialId(
    uuid: string,
    socialProvider: SocialProvider,
    socialId: string,
  ): Promise<UserEntity> {
    const userEntity = new UserEntity();
    userEntity.id = uuid;
    userEntity.socialProvider = socialProvider;
    userEntity.socialId = socialId;

    return this.save(userEntity);
  }

  /**
   * 사용자 UUID로 사용자 데이터를 삭제합니다.
   * @param uuid 사용자 UUID
   * @returns void
   */
  async deleteById(uuid: string): Promise<void> {
    // 1. Redis 캐시에서 삭제
    const cacheKey = this.getCacheKey(uuid);
    await this.redisService.del(cacheKey);

    // 2. MySQL 데이터 삭제
    await this.mysqlService.delete(uuid);
  }

  private getCacheKey(uuid: string): string {
    return `user:${uuid}`;
  }
}
