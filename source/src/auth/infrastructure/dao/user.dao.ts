import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
export class UserDAO {
  // @OneToMany(() => AuthTokenDAO, (authToken) => authToken.user) // 관계 정의
  // authTokens: AuthTokenDAO[];

  /**
   * 사용자 고유 식별자입니다. UUID 형식으로 자동 생성됩니다.
   */
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /**
   * 사용자가 설정한 닉네임입니다. 최대 20자까지 허용됩니다.
   */
  @Column({ type: 'varchar', length: 20, default: 'Anonymous' })
  nickname: string;

  /**
   * 사용자가 선택한 캐릭터를 나타냅니다.
   * 가능한 값: 'rabbit', 'dog', 'hamster', 'cat'.
   */
  @Column({
    type: 'enum',
    enum: ['rabbit', 'dog', 'hamster', 'cat'],
    default: 'Rabbit',
  })
  character_id: 'rabbit' | 'dog' | 'hamster' | 'cat';

  /**
   * 사용자가 신고받은 횟수를 나타냅니다.
   * 기본값은 0이며, 정수형 값으로 저장됩니다.
   */
  @Column({ type: 'int', default: 0 })
  report_count: number;

  /**
   * 사용자가 로그인한 소셜 서비스 제공자를 나타냅니다.
   * 가능한 값: 'google', 'kakao', 'apple'.
   */
  @Column({ type: 'enum', enum: ['google', 'kakao', 'apple'] })
  social_provider: 'google' | 'kakao' | 'apple';

  /**
   * 소셜 서비스에서 제공하는 고유 사용자 식별자입니다.
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  social_id: string;

  /**
   * 암호화된 사용자 패스워드입니다.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  hashed_password: string;

  /**
   * 데이터베이스에 해당 레코드가 생성된 시간을 나타냅니다.
   * 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  created_at: Date;

  /**
   * 데이터베이스에 해당 레코드가 마지막으로 수정된 시간을 나타냅니다.
   * 자동으로 설정됩니다.
   */
  @UpdateDateColumn()
  updated_at: Date;
}
