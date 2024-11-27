import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('AuthToken')
export class AuthTokenDAO {
  /**
   * 자동 생성되는 UUID (고유 ID)
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 사용자 UUID (User 테이블의 uuid 참조)
   */
  @Column({ type: 'uuid' })
  user_uuid: string;

  /**
   * Access Token 값
   */
  @Column({ type: 'text' })
  access_token: string;

  /**
   * Refresh Token 값
   */
  @Column({ type: 'text' })
  refresh_token: string;

  /**
   * Access Token 만료 시간
   */
  @Column({ type: 'datetime' })
  access_token_expiry: Date;

  /**
   * Refresh Token 만료 시간
   */
  @Column({ type: 'datetime' })
  refresh_token_expiry: Date;

  /**
   * 레코드 생성 시간
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * 레코드 수정 시간
   */
  @UpdateDateColumn()
  updated_at: Date;
}
