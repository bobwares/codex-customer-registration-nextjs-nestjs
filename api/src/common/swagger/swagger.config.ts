/**
 * App: Customer Registration
 * Package: api/src/common/swagger
 * File: swagger.config.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:15:48Z
 * Exports: configureSwagger
 * Description: Helper function that wires Swagger UI and JSON endpoints onto a NestJS application instance.
 */
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProblemDetailsDto } from '../dtos/problem-details.dto';

export function configureSwagger(app: INestApplication, configService: ConfigService): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Customer Registration API')
    .setVersion(configService.get<string>('npm_package_version') ?? '0.0.1')
    .setDescription('Customer onboarding service CRUD endpoints and documentation.')
    .addTag('Customer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [ProblemDetailsDto],
  });
  SwaggerModule.setup('api/docs', app, document);

  const httpAdapter = app.getHttpAdapter().getInstance();
  httpAdapter.get('/api/openapi.json', (_req: unknown, res: any) => {
    res.type('application/json').send(document);
  });
}
