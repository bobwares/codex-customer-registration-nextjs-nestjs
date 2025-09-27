/**
 * # App: Customer Registration API
 * # Package: api.src
 * # File: main.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: Bootstraps the NestJS HTTP server. The bootstrap function creates the application instance,
 * #              enables global validation with transformation and whitelisting, resolves the listening port
 * #              from the ConfigService, and starts the HTTP listener.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);

  await app.listen(port);
}

void bootstrap();
