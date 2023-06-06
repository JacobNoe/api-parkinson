/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(private dataSource: DataSource) {}

  findAll() {
    return `This action returns all usuarios`;
  }

  async findOne(correo: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      const usuario = await queryRunner.manager.query(`
        SELECT * FROM usuarios WHERE correo='${correo}'
      `);
      
      return usuario[0];
    } catch (error) {
      return error;
    }
  }
  async findProfile(data: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      const {correo} = data;
      const usuario = await queryRunner.manager.query(`
        SELECT u.id, u.Nombre, u.Apellidos, i.*
        FROM usuarios u
        LEFT JOIN ImagenPerfil i
        ON u.id = i.id
        WHERE u.correo='${correo}'
      `);
      return usuario[0];
    } catch (error) {
      return error;
    }
  }

}
