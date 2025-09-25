/**
 * App: Customer Registration
 * Package: api/src
 * File: main.ts
 * Version: 0.2.0
 * Turns: 1, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: (none)
 * Description: Bootstraps the NestJS application, configures validation, structured logging, and Swagger documentation.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { version as appVersion } from '../package.json';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(PinoLogger);
  app.useLogger(logger);

  const validationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const messages = formatValidationErrors(errors);
      if (containsWhitelistViolations(errors)) {
        return new BadRequestException(messages);
      }
      return new UnprocessableEntityException(messages);
    },
  });
  app.useGlobalPipes(validationPipe);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('REST API for managing customer onboarding records.')
    .setVersion(appVersion)
    .addTag('Customer')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);
  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.get('/api/openapi.json', (_: unknown, res: { json: (body: unknown) => void }) => {
    res.json(document);
  });

  await app.listen(3000);
}

function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      if (error.children?.length) {
        return formatValidationErrors(error.children);
      }
      return [`${error.property} is invalid`];
    })
    .flat();
}

function containsWhitelistViolations(errors: ValidationError[]): boolean {
  return errors.some((error) => {
    if (error.constraints) {
      return Object.keys(error.constraints).some((constraint) =>
        ['whitelistValidation', 'forbiddenProperty'].includes(constraint),
      );
    }
    return error.children ? containsWhitelistViolations(error.children) : false;
  });
}

void bootstrap();
