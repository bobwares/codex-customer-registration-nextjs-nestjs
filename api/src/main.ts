/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: bootstrap
 * Description: NestJS bootstrap file that configures global validation and starts the HTTP server using the configured port.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';

async function bootstrap(): Promise<void> {
  const desiredLevel = (process.env.LOG_LEVEL ?? 'log') as LogLevel;
  const order: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  const levelIndex = Math.max(order.indexOf(desiredLevel), 0);
  const levels = order.slice(0, levelIndex + 1);

  const app = await NestFactory.create(AppModule, { logger: levels });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('app.port', 3000);
  const logger = app.get(JsonLogger);
  logger.setLogLevels(levels);

  await app.listen(port);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap Nest application', error);
  process.exitCode = 1;
});
