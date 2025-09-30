/**
 * # App: Customer Registration API
 * # Package: api/src/scripts
 * # File: emit-openapi.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:00:00Z
 * # Description: CLI script that bootstraps the Nest application and writes the generated OpenAPI specification to disk.
 */
import 'reflect-metadata';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { JsonLogger } from '../common/logging/json-logger.service';
import { buildOpenApiDocument } from '../openapi';

async function emitOpenApi(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('Working directory:', process.cwd());
  process.env.DATABASE_TYPE = process.env.DATABASE_TYPE ?? 'sqlite';
  process.env.DATABASE_NAME = process.env.DATABASE_NAME ?? ':memory:';
  const { AppModule } = await import('../app.module');
  const app = await NestFactory.create(AppModule, { logger: false });
  const jsonLogger = app.get(JsonLogger);
  jsonLogger.configure(['error']);
  app.useLogger(jsonLogger);
  await app.init();

  const document = await buildOpenApiDocument(app);
  const outputDir = resolve(process.cwd(), 'openapi');
  await mkdir(outputDir, { recursive: true });
  const outputPath = resolve(outputDir, 'openapi.json');

  try {
    await writeFile(outputPath, JSON.stringify(document, null, 2), 'utf-8');
    // eslint-disable-next-line no-console
    console.log('OpenAPI specification written to', outputPath);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to write OpenAPI specification', error);
    throw error;
  }

  await app.close();
}

emitOpenApi().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to emit OpenAPI specification', error);
  process.exitCode = 1;
});
