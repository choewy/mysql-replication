import { Body, Controller, Post } from '@nestjs/common';

import { SignInBodyDto, SignUpBodyDto } from '@dto/auth';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() body: SignInBodyDto) {
    return this.authService.signin(body);
  }

  @Post('signup')
  async signup(@Body() body: SignUpBodyDto) {
    return this.authService.signup(body);
  }
}
