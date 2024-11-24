import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '../domain/auth.repository';
import { IExternalAuthService } from '../domain/external-auth.service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly externalAuthService: IExternalAuthService,
  ) {}
}
