import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PacientesModule } from './pacientes/pacientes.module';
import { MensajesModule } from './mensajes/mensajes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'preventsoft.com',
      port: 3306,
      username: 'jalorhco_antonio',
      password: 'minayork1985!',
      database: 'jalorhco_modulo',
      entities: [],
      synchronize: true,
    }),
    UsuariosModule,
    AuthModule,
    PacientesModule,
    MensajesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
