import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

const PORT = process.env.PORT || 3000

async function bootstrap() {
  dotenv.config(); 

  console.log(PORT);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:8100'
  });
  await app.listen(PORT);
  console.log("Serve PORT", PORT);
}
bootstrap();
