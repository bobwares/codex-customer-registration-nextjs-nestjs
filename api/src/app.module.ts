/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T19:06:09Z
 * Exports: AppModule
 * Description: Defines the root NestJS application module that composes feature modules.
 */
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
