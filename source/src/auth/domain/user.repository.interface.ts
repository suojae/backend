import { UserEntity } from './user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  save(userEntity: UserEntity): Promise<UserEntity>;

  findById(uuid: string): Promise<UserEntity | null>;

  update(uuid: string, partialUser: Partial<UserEntity>): Promise<void>;

  delete(uuid: string): Promise<void>;
}
