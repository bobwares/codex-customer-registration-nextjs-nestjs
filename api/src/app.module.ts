/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T03:07:00Z
 * Exports: AppModule
 * Description: Defines the root NestJS module and wires the health module into the application.
 */
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
