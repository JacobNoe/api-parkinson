import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
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
            this.enviar_notificacion(respEvalTrazos.result.type, respEvalTrazos.result.title, respEvalTrazos.result.msg, idPatient);
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
            this.enviar_notificacion(respEvalVoz.result.type, respEvalVoz.result.title, respEvalVoz.result.msg, idPatient);
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


    async enviar_notificacion(type: string, title: string, msg: string, idPatient:any): Promise<void> {
        console.log("TYPE",type);
        console.log("TITLE",title);

        let imgType = '';

        // Validar el tipo de mensaje
        if (type === 'Recomendación') {
            imgType = 'https://cdn-icons-png.flaticon.com/512/9482/9482226.png';
        } else if (type === 'Notificación') {
            imgType = 'https://cdn-icons-png.flaticon.com/512/3602/3602137.png';
        } else if (type === 'Alerta') {
            imgType = 'https://cdn-icons-png.flaticon.com/512/5974/5974693.png';
        } else if (type === 'Mensaje') {
            imgType = 'https://cdn-icons-png.flaticon.com/512/893/893257.png';
        } else {
            imgType = 'https://cdn-icons-png.flaticon.com/512/893/893257.png';
        }

        // Definir la URL del EndPoint
        const url = 'https://fcm.googleapis.com/fcm/send';

        // Definir los encabezados
        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer AAAA30T5osU:APA91bHK1OsjE_XzQ62cA6xz4sQderER5ruQD-43xZ44qvaIaYmnkkzBCP-rsImq6LoZsohAuaFvkxTY-R9L7gXx2x5kXLYekLg2YXnvgxEMAW0dj6xWrMVBYeSnrHe9MbBNzTKAx7BW',
        };

        // Definir el cuerpo de la solicitud
        const data = {
            notification: {
                title: title,
                body: msg,
                click_action: 'FLUTTER_NOTIFICATION_CLICK',
                image: imgType,
                color: '#E92D3B',
                tag: type,
            },
            to: 'eIewiodmSemsYWbHLmHLhI:APA91bE9h9HJU2cuTYg6FoYsamlVTa1qlahAOE_cAwgQI52spaldC-ggs364dn9VKpPO0nYpR5rGp_HINuu8tvXEMrxJicYMKyeTx4Q2MPp200kKG_yNNkv3KtpUhhU49M0UIvGUHGvV',
        };

        try {
            // Enviar la solicitud POST utilizando Axios
            const response: AxiosResponse = await axios.post(url, data, { headers });

            // Verificar el estado de la respuesta
            if (response.status === 200) {
                console.log('La solicitud PUSH se ha enviado correctamente.');
            } else {
                console.log('Error al enviar la solicitud. Código de estado:', response.status);
            }
        } catch (error) {
            console.log('Error al enviar la solicitud:', error.message);
        }
    }


}