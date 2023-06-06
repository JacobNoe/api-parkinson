import { Controller, Get, Query } from '@nestjs/common';
import { PacientesService } from './pacientes.service';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}
  @Get()
  findAll(@Query() idCuidador: number) {
    return this.pacientesService.findPatientsByCarer(idCuidador);
  }
  @Get('mensajes/paciente')
  findOne(@Query() id: number) {
    return this.pacientesService.findOne(id);
  }
}
 