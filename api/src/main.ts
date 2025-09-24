/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T03:07:00Z
 * Exports: bootstrap
 * Description: Bootstraps the NestJS application and configures global validation pipes.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(3000);
}

void bootstrap();
