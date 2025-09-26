/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-26T02:55:41Z
 * Exports: bootstrap
 * Description: Entry point for the NestJS application that configures global validation and starts the HTTP server.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}

void bootstrap();
