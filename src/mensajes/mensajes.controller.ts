import { Body, Controller, Patch, Post } from '@nestjs/common';
import { MensajesService } from './mensajes.service';

@Controller('mensajes')
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) { }
  @Post()
  create(@Body() req) {
    return this.mensajesService.post(req);
  }

  @Post('evalTrazos')
  evalTrazos(@Body() req) {
    return this.mensajesService.evalTrazos(req);
  }

  @Post('evalVoz')
  evalVoz(@Body() req) {
    return this.mensajesService.evalVoz(req);
  }

  @Patch()
  update(@Body() req) {
    return this.mensajesService.patch(req);
  }
}

