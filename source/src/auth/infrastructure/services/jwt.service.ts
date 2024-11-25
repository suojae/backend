import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '30d' });
  }

  verifyAccessToken(token: string): any {
    return this.jwtService.verify(token);
  }

  cerifyRefreshToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
