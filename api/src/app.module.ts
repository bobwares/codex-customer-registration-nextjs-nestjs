/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-26T02:55:41Z
 * Exports: AppModule
 * Description: Root NestJS application module that aggregates feature modules for the backend service.
 */
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
