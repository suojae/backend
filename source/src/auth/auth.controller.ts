import { Controller } from '@nestjs/common';
import { AuthService } from './application/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
