import { Request, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { SkipAuth } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @SkipAuth()
  @Post('auth/login')
  async login(@Request() req) {
    console.log("REQ:", req.user);
    return this.authService.login(req.user);
  }
}
