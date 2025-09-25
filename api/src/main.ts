/**
 * App: Customer Registration
 * Package: api
 * File: main.ts
 * Version: 0.2.0
 * Turns: 1-4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: bootstrap
 * Description: Application bootstrap that wires global validation, Swagger
 *              documentation, and exposes the OpenAPI document over HTTP.
 */
import 'reflect-metadata';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));
  const config = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setDescription('Secure onboarding endpoints for customer registration workflows.')
    .setVersion(pkg.version ?? '0.0.0')
    .addTag('customers')
    .addTag('health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/openapi.json', (req: unknown, res: any) => {
    res.type('application/json').send(document);
  });

  if (process.env.OPENAPI_EMIT === 'true') {
    const outputDir = join(process.cwd(), 'openapi');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    const openApiPath = join(outputDir, 'openapi.json');
    writeFileSync(openApiPath, JSON.stringify(document, null, 2), 'utf8');
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to bootstrap Nest application', error);
  process.exitCode = 1;
});
