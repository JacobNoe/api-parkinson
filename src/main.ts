import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';


const PORT = process.env.PORT || 3000

async function bootstrap() {
  dotenv.config(); 

  console.log(PORT);
  const app = await NestFactory.create(AppModule);

  // Configuración del middleware body-parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.enableCors({});
  await app.listen(PORT);
  console.log("Serve PORT", PORT);
}
bootstrap();
