import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MensajesService {
    constructor(private dataSource: DataSource) { }
    async post(message: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const { idPaciente, idMensaje } = message;
            const fechaHoraActual = new Date(Date.now())

            console.log("FECHA", fechaHoraActual);
            const data = await queryRunner.manager.query("INSERT INTO `BUZON.PROC.MENSAJES` (fecha,idMensaje, idPaciente, idMedico, estado) SELECT '" + fechaHoraActual + "', " + idMensaje + ", " + idPaciente + ", idMedico,1 FROM `USUARIOS.REL.PACIENTES_MEDICOS` WHERE idPaciente=" + idPaciente + ";");
            const mensaje = await queryRunner.manager.query("SELECT * FROM `BUZON.PROC.MENSAJES` WHERE idProcMensaje=" + data.insertId + ";");
            return { msg: "Mensaje agregado correctamente", mensaje };
        } catch (error) {
            console.log(error);
            return { msg: 'Error en el servidor.' };
        }
    }

    async patch(message: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const { idProcMensaje, estado } = message;
            const mensaje = await queryRunner.manager.query("UPDATE `BUZON.PROC.MENSAJES` SET estado=" + estado + " WHERE idProcMensaje=" + idProcMensaje + ";");
            return { msg: "Mensaje actualizado correctamente" };
        } catch (error) {
            console.log(error);
            return { msg: 'Error en el servidor.' };
        }
    }
}