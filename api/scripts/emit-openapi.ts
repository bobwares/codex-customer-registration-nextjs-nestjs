/**
 * App: Customer Registration
 * Package: api/scripts
 * File: emit-openapi.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:04:27Z
 * Exports: none
 * Description: CLI script that bootstraps the Nest application and writes the OpenAPI JSON document to disk.
 */
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { ProblemDetailsDto } from '../src/common/dtos/problem-details.dto';

async function emit(): Promise<void> {
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';
  process.env.LOG_FORMAT = process.env.LOG_FORMAT ?? 'json';
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setVersion(configService.get<string>('npm_package_version') ?? '0.0.1')
    .setDescription('Customer onboarding service CRUD endpoints and documentation.')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ProblemDetailsDto],
  });

  const outputDir = join(__dirname, '..', 'openapi');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(join(outputDir, 'openapi.json'), JSON.stringify(document, null, 2));

  await app.close();
  process.exit(0);
}

void emit();
