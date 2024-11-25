import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = 10;

  /**
   * 비밀번호를 해싱합니다
   * @param password 원본 비밀번호
   * @returns 해싱된 비밀번호
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * 원본 비밀번호와 해싱된 비밀번호를 비교합니다
   * @param password 원본 비밀번호
   * @param hashedPassword 해싱된 비밀번호
   * @returns 비밀번호가 일치여부 bool타입 반환
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
