import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository.interface';
import { IAuthRepository } from '../domain/auth.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}
}
