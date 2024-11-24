import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  saveAuthData(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
