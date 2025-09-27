/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:02:17Z
 * Exports: bootstrap
 * Description: Bootstraps the NestJS application, configures logging, global validation, and listens on the configured port.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';

function resolveLogLevels(envLevel: string | undefined): LogLevel[] {
  const normalized = (envLevel ?? 'log').toLowerCase();
  const orderedLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  const fallback: LogLevel[] = ['error', 'warn', 'log'];
  const maxIndex = orderedLevels.indexOf(normalized as LogLevel);
  return maxIndex >= 0 ? orderedLevels.slice(0, maxIndex + 1) : fallback;
}

export async function bootstrap(): Promise<void> {
  const logLevels = resolveLogLevels(process.env.LOG_LEVEL);
  const app = await NestFactory.create(AppModule, { logger: logLevels });
  const logger = app.get(JsonLogger);
  logger.setLogLevels(logLevels);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);
  await app.listen(port);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Application failed to start', error);
  process.exitCode = 1;
});
