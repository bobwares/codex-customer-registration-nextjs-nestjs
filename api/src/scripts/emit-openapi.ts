/**
 * App: Customer Registration
 * Package: api/src/scripts
 * File: emit-openapi.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: (none)
 * Description: Generates the OpenAPI specification by bootstrapping the NestJS application and writing the JSON document to disk.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppModule } from '../app.module';
import { version as appVersion } from '../../package.json';

async function emitOpenApiDocument(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('REST API for managing customer onboarding records.')
    .setVersion(appVersion)
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const outputDir = join(process.cwd(), 'openapi');
  await mkdir(outputDir, { recursive: true });
  const outputPath = join(outputDir, 'openapi.json');
  await writeFile(outputPath, JSON.stringify(document, null, 2), 'utf8');
   
  console.log(`OpenAPI document emitted to ${outputPath}`);

  await app.close();
}

void emitOpenApiDocument();
