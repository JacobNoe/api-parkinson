import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class PacientesService {
  constructor(private dataSource: DataSource) {}

    async findPatientsByCarer(data:any) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
          await queryRunner.connect();
          const {idCuidador} = data;
          const pacientes = await queryRunner.manager.query(`
          SELECT * FROM vista_pacientes_cuidador WHERE idCuidador='${idCuidador}'
          `);
          return pacientes;
        } catch (error) {
          console.log(error);
          
          return {msg:'Error en el servidor.'};
        }
      }
    async findOne(data:any) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
          await queryRunner.connect();
          const {id} = data;
          const pacientes = await queryRunner.manager.query(`
          SELECT u.Nombre, u.Apellidos, inf.genero, inf.edad, inf.tipodsangre, inf.celular, inf.ocupacion, d.Calle, d.Numero, d.Colonia, d.Ciudad, d.CP, d.Pais, d.estado, i.*
        FROM usuarios u
        LEFT JOIN infopersonal inf
        ON u.id = inf.id
        LEFT JOIN Domicilio d
        ON u.id = d.id
        LEFT JOIN ImagenPerfil i
        ON u.id = i.id
        WHERE u.id='${id}'
          `);
        const recomendaciones = await queryRunner.manager.query(`
        SELECT * FROM vista_mensajes
        WHERE idPaciente='${id}' AND idTipoMensaje = '1'
        `);
        const notificaciones = await queryRunner.manager.query(`
        SELECT * FROM vista_mensajes
        WHERE idPaciente='${id}' AND idTipoMensaje = '2'
        `);
        const alertas = await queryRunner.manager.query(`
        SELECT * FROM vista_mensajes
        WHERE idPaciente='${id}' AND idTipoMensaje = '3'
        `);
        const mensajes = await queryRunner.manager.query(`
        SELECT * FROM vista_mensajes
        WHERE idPaciente='${id}' AND idTipoMensaje = '4'
        `);
          return {pacientes, recomendaciones, notificaciones, alertas, mensajes};
        } catch (error) {
          console.log(error);
          
          return {msg:'Error en el servidor.'};
        }
      }

}