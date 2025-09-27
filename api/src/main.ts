/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.2.0
 * Turns: 1, 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:02:49Z
 * Exports: bootstrap
 * Description: Application entry point configuring logging, validation, Swagger, and global error handling before starting HTTP.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { configureSwagger } from './common/swagger/swagger.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);
  const logger = app.get(JsonLogger);

  const level = (configService.get<string>('LOG_LEVEL') ?? 'log') as LogLevel;
  logger.configureLevels(level);
  app.useLogger(logger);
  app.flushLogs();

  const loggingInterceptor = new LoggingInterceptor(logger);
  const exceptionFilter = new HttpExceptionFilter(logger);
  app.useGlobalInterceptors(loggingInterceptor);
  app.useGlobalFilters(exceptionFilter);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  configureSwagger(app, configService);
  const port = parseInt(configService.get<string>('PORT') ?? '3000', 10);
  await app.listen(port);
}

void bootstrap();
