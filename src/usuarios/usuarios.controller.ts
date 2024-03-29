import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get('profile')
  findOne(@Query() correo: string) {
    return this.usuariosService.findProfile(correo);
  }
}
