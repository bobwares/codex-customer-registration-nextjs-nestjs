/**
 * App: Customer Registration
 * Package: api/src/health
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T03:07:00Z
 * Exports: HealthModule
 * Description: Declares the health module that exposes application status endpoints.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
