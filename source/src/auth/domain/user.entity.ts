import { UserDAO } from '../infrastructure/dao/user.dao';
import { SocialProvider } from './social-provider.type';

export class UserEntity {
  id: string;
  nickname?: string;
  themeAnimal?: Animal;
  password: string; // 원본 비밀번호 (해시되지 않음)
  socialProvider: SocialProvider;
  socialId: string;

  /**
   * UserEntity를 UserDAO로 변환합니다.
   * @param hashedPassword 해싱된 비밀번호
   * @returns UserDAO 객체
   */
  toDAO(hashedPassword: string): UserDAO {
    const dao = new UserDAO();
    dao.uuid = this.id;
    dao.nickname = this.nickname;
    dao.character_id = this.themeAnimal;
    dao.hashed_password = hashedPassword;
    dao.social_provider = this.socialProvider;
    dao.social_id = this.socialId;
    dao.report_count = 0; // 기본값 설정
    return dao;
  }

  /**
   * UserDAO를 UserEntity로 변환합니다.
   * @param dao UserDAO 객체
   * @returns UserEntity 객체
   */
  static fromDAO(dao: UserDAO): UserEntity {
    const entity = new UserEntity();
    entity.id = dao.uuid;
    entity.nickname = dao.nickname;
    entity.themeAnimal = dao.character_id as Animal;
    entity.password = ''; // DAO에는 원본 비밀번호가 없으므로 빈 문자열
    entity.socialProvider = dao.social_provider as SocialProvider;
    entity.socialId = dao.social_id;
    return entity;
  }

  /**
   * 부분 업데이트를 위한 DAO 변환 메서드
   * @param hashedPassword 해싱된 비밀번호 (옵션)
   * @returns Partial<UserDAO>
   */
  toPartialDAO(hashedPassword?: string): Partial<UserDAO> {
    const partialDAO: Partial<UserDAO> = {};

    if (this.nickname !== undefined) {
      partialDAO.nickname = this.nickname;
    }
    if (this.themeAnimal !== undefined) {
      partialDAO.character_id = this.themeAnimal;
    }
    if (this.password !== undefined && hashedPassword) {
      partialDAO.hashed_password = hashedPassword;
    }
    if (this.socialProvider !== undefined) {
      partialDAO.social_provider = this.socialProvider;
    }
    if (this.socialId !== undefined) {
      partialDAO.social_id = this.socialId;
    }

    return partialDAO;
  }

  /**
   * Partial<UserDAO>를 UserDAO로 변환하고 빠진 필드를 채웁니다.
   * @param partialDAO Partial<UserDAO>
   * @returns 완전한 UserDAO 객체
   */
  static fillMissingProperties(partialDAO: Partial<UserDAO>): UserDAO {
    const dao = new UserDAO();

    dao.uuid = partialDAO.uuid || ''; // 기본값 설정
    dao.nickname = partialDAO.nickname || 'default_nickname';
    dao.character_id = partialDAO.character_id || Animal.Dog; // 기본값: Dog
    dao.hashed_password = partialDAO.hashed_password || '';
    dao.social_provider = partialDAO.social_provider || 'apple'; // 기본값: 'apple'
    dao.social_id = partialDAO.social_id || 'default_social_id';
    dao.report_count = partialDAO.report_count ?? 0; // 기본값: 0

    return dao;
  }
}

export enum Animal {
  Dog = 'dog',
  Cat = 'cat',
  Rabbit = 'rabbit',
  Hamster = 'hamster',
}
