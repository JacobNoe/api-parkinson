/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService
  ) {}

  async validateUser(correo: string, contrasena: string): Promise<any> {
    const user = await this.usuarioService.findOne(correo);
    if (user && user.Contrasena === contrasena) {
      const { contrasena, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { correo: user.Correo, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
