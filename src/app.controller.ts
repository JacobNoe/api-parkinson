import { Request, Controller, Post, UseGuards, Body  } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { SkipAuth } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @SkipAuth()
  @Post('auth/login')
  create(@Body() body: any) {
    console.log("BODY", body);
    console.log("**************************"); // Imprimir el cuerpo de la solicitud en la consola
    // Imprimir el cuerpo de la solicitud en la consola
    // Resto del código...
  }
  async login(@Request() req) {
    // console.log("REQ:", req.user);
    return this.authService.login(req.user);
  }
}
