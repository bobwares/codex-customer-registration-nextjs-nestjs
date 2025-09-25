/**
 * App: Customer Registration
 * Package: api
 * File: emit-openapi.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (script)
 * Description: CLI entry point that generates the OpenAPI specification and
 *              writes it to the openapi/ directory.
 */
import 'reflect-metadata';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

async function emitOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  const config = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('Customer onboarding REST API')
    .setVersion(pkg.version ?? '0.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outputDir = join(process.cwd(), 'openapi');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = join(outputDir, 'openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  await app.close();
  // eslint-disable-next-line no-console
  console.log(`OpenAPI document written to ${outputPath}`);
}

emitOpenApi().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to emit OpenAPI document', error);
  process.exit(1);
});
