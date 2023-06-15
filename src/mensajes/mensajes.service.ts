import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
const axios = require('axios');

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

    async crearRegistro(idPaciente, idMensaje) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const fechaHoraActual = new Date(Date.now());

            const fechaFormateada = fechaHoraActual.toISOString().slice(0, 19).replace('T', ' ');

            // console.log("FECHA", fechaFormateada);

            const data = await queryRunner.manager.query("INSERT INTO `BUZON.PROC.MENSAJES` (fecha,idMensaje, idPaciente, idMedico, estado) SELECT '" + fechaFormateada + "', " + idMensaje + ", " + idPaciente + ", idMedico,1 FROM `USUARIOS.REL.PACIENTES_MEDICOS` WHERE idPaciente=" + idPaciente + ";");
            const mensaje = await queryRunner.manager.query("SELECT * FROM `BUZON.PROC.MENSAJES` WHERE idProcMensaje=" + data.insertId + ";");
            console.log("Registro creado");
            return { msg: "Mensaje agregado correctamente", mensaje };
        } catch (error) {
            // console.log(error);
            return { msg: 'Error en el servidor.' };
        }
    }

    async evalTrazos(message: any) {
        try {
            const { idPatient, prom_res_eval } = message;
            const respEvalTrazos = await this.postApiEvalTrazos(prom_res_eval);
            console.log("RESP", idPatient, respEvalTrazos.result.id);
            this.crearRegistro(idPatient, respEvalTrazos.result.id);
            return { msg: "Respuesta de Trazos", respEvalTrazos };
        } catch (error) {
            // console.log(error);
            return { msg: 'Error en el servidor.' };
        }
    }

  

    async postApiEvalTrazos(prom_res_eval) {
        try {
            const variables = { "prom_res_eval": prom_res_eval };
            // console.log("NRES", variables);
            const response = await axios.post('https://parkinson-modulo-ia-production.up.railway.app/trazos/asignar', variables);
            // console.log("API TRAZOS", response);
            return response.data;
        } catch (error) {
            // console.error("ERRORR", error);
            throw error; // Lanza el error para que pueda ser capturado en el bloque catch del método evalTrazos
        }
    }

      async evalVoz(message: any) {
        try {
            
            const { idPatient, mdvpFo, mdvpFlo, spread1, ppe } = message;
            
            const respEvalVoz = await this.postApiEvalVoz(mdvpFo, mdvpFlo, spread1, ppe);

            // console.log("RESP", idPatient, respEvalVoz.result.idM);

            this.crearRegistro(idPatient, respEvalVoz.result.idM);

            return { msg: "Respuesta de Trazos", respEvalVoz };
        } catch (error) {
            // console.log(error);
            return { msg: 'Error en el servidor - Voz.' };
        }
    }

    async postApiEvalVoz(mdvpFo, mdvpFlo, spread1, ppe) {    
        try {
            const variables = {
                "MDVP:Fo(Hz)": mdvpFo,
                "MDVP:Flo(Hz)": mdvpFlo,
                "spread1": spread1,
                "PPE": ppe,
              };
            // console.log("NRES", variables);
            const response = await axios.post('https://parkinson-modulo-ia-production.up.railway.app/voz/asignar', variables);
            // console.log("API VOZ", response);
            return response.data;
        } catch (error) {
            // console.error("ERRORR", error);
            throw error; // Lanza el error para que pueda ser capturado en el bloque catch del método evalTrazos
        }
    }


    async patch(message: any) {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            const { idProcMensaje, estado } = message;
            await queryRunner.manager.query("UPDATE `BUZON.PROC.MENSAJES` SET estado=" + estado + " WHERE idProcMensaje=" + idProcMensaje + ";");
            const mensaje = await queryRunner.manager.query("SELECT * FROM `BUZON.PROC.MENSAJES` WHERE idProcMensaje=" + idProcMensaje + ";");
            return { msg: "Mensaje actualizado correctamente", mensaje };
        } catch (error) {
            console.log(error);
            return { msg: 'Error en el servidor.' };
        }
    }
}