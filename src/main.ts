import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger(`${AppModule.name} - Main`);

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.port,
    },
  });

  await app.listen();
  logger.log(`Producs Microservice running on: ${envs.port}`);
}
bootstrap();
