/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: AppModule
 * Description: Root NestJS module that configures global configuration with validation and wires feature modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validationSchema,
    }),
    HealthModule,
  ],
})
export class AppModule {}
