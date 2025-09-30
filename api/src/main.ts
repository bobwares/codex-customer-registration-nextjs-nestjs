/**
 * # App: Customer Registration API
 * # Package: api/src
 * # File: main.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Bootstraps the NestJS application, configuring logging, validation, and HTTP listener startup logic.
 * #
 * # Functions
 * # - bootstrap: Builds the NestJS application, applies structured logging and validation, and starts the HTTP server.
 */
import 'reflect-metadata';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';

const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

async function bootstrap(): Promise<void> {
  const configuredLevel = (process.env.LOG_LEVEL ?? 'log').toLowerCase() as LogLevel;
  const levelIndex = LOG_LEVELS.indexOf(configuredLevel);
  const resolvedIndex = levelIndex >= 0 ? levelIndex : LOG_LEVELS.indexOf('log');
  const levels = LOG_LEVELS.slice(0, resolvedIndex + 1);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: levels,
  });

  const jsonLogger = app.get(JsonLogger);
  jsonLogger.configure(levels);
  app.useLogger(jsonLogger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  await app.listen(port);
  jsonLogger.log(`API listening on port ${port}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
