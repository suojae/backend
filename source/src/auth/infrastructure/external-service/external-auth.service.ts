import { Injectable } from '@nestjs/common';
import { IExternalAuthService } from '../../domain/external-auth.service.interface';

@Injectable()
export class ExternalAuthService implements IExternalAuthService {
  authenticateWithKakao(token: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  authentiacteWithApple(token: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
