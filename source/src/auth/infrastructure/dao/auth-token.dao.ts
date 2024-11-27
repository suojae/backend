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
   * UUID 형식으로 자동 생성되는 고유 식별자입니다.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 사용자와 연관된 고유 식별자입니다. User 테이블의 UUID를 참조합니다.
   */
  @Column({ type: 'uuid' })
  user_uuid: string;

  /**
   * 사용자 인증을 위해 발급된 Access Token을 저장합니다.
   */
  @Column({ type: 'text' })
  access_token: string;

  /**
   * Access Token이 만료되었을 때 재발급을 위한 Refresh Token을 저장합니다.
   */
  @Column({ type: 'text' })
  refresh_token: string;

  /**
   * Access Token이 만료되는 시각을 저장합니다.
   */
  @Column({ type: 'datetime' })
  access_token_expiry: Date;

  /**
   * Refresh Token이 만료되는 시각을 저장합니다.
   */
  @Column({ type: 'datetime' })
  refresh_token_expiry: Date;

  /**
   * 해당 레코드가 생성된 시각을 저장합니다. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * 해당 레코드가 마지막으로 수정된 시각을 저장합니다. 자동으로 설정됩니다.
   */
  @UpdateDateColumn()
  updated_at: Date;
}
