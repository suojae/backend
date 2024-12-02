import { UserEntity } from './user.entity';
import { SocialProvider } from './social-provider.type';

export interface IUserRepository {
  /**
   * 사용자 UUID로 사용자 조회
   */
  findById(uuid: string): Promise<UserEntity | null>;

  /**
   * 소셜 ID로 사용자 조회
   */
  findBySocialId(
    socialProvider: SocialProvider,
    socialId: string,
  ): Promise<UserEntity | null>;

  /**
   * 사용자 데이터를 저장
   */
  save(userEntity: UserEntity): Promise<UserEntity>;

  /**
   * 사용자 데이터를 삭제
   */
  deleteById(uuid: string): Promise<void>;
}
