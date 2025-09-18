/**
 * App: Customer Registration
 * Package: api
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: bootstrap
 * Description: Boots the NestJS HTTP server, loading configuration and enabling class
 *              validation for the customer registration API.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

export async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.APP_PORT ? Number(process.env.APP_PORT) : 3001;
  await app.listen(port);
}

void bootstrap();
