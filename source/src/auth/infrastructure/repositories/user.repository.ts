import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/user.entity';

@Injectable()
export class UserRepository {
  findById(id: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }

  save(user: UserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
