import { UserDAO } from '../infrastructure/dao/user.dao';

export class UserEntity {
  id: string;
  nickname: string;
  themeAnimal: Animal;
  password: string; // 원본 비밀번호 (해시되지 않음)

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
    dao.social_provider = null; // 기본값 설정
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
    return entity;
  }
}

enum Animal {
  Dog = 'dog',
  Cat = 'cat',
  Rabbit = 'rabbit',
  Hamster = 'hamster',
}
