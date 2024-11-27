import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
export class UserDAO {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 50 })
  nickname: string;

  @Column({ type: 'enum', enum: ['rabbit', 'dog', 'hamster', 'cat'] })
  character_id: 'rabbit' | 'dog' | 'hamster' | 'cat';

  @Column({ type: 'int', default: 0 })
  report_count: number;

  @Column({ type: 'enum', enum: ['google', 'kakao', 'apple'] })
  social_provider: 'google' | 'kakao' | 'apple';

  @Column({ type: 'varchar', length: 255 })
  social_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
