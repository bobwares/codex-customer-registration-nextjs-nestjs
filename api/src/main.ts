/**
 * # App: Customer Registration API
 * # Package: api/src
 * # File: main.ts
 * # Version: 0.2.0
 * # Turns: 1,4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: Bootstraps the NestJS application, configuring logging, validation, global HTTP error handling,
 * #              and Swagger document exposure before starting the HTTP listener.
 * #
 * # Functions
 * # - bootstrap: Builds the NestJS application, applies structured logging and validation, and starts the HTTP server.
 */
import 'reflect-metadata';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { HttpStatus, LogLevel, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { HttpExceptionFilter, ProblemDetail } from './common/http';
import { ResponseCustomerDto } from './customer/dtos/response-customer.dto';
import {
  CustomerAddressDto,
  CustomerPhoneNumberDto,
  CustomerPrivacySettingsDto,
} from './customer/dtos/create-customer.dto';

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
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost, jsonLogger));

  const pkg = JSON.parse(
    await fs.readFile(path.resolve(__dirname, '..', 'package.json'), 'utf8'),
  ) as { version?: string };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('HTTP API for managing the customer onboarding lifecycle.')
    .setVersion(pkg.version ?? '1.0.0')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [
      ProblemDetail,
      ResponseCustomerDto,
      CustomerAddressDto,
      CustomerPhoneNumberDto,
      CustomerPrivacySettingsDto,
    ],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: '/api/openapi.json',
    yamlDocumentUrl: '/api/openapi.yaml',
  });

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
