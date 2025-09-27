/**
 * App: Customer Registration
 * Package: api/src/health
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: HealthModule
 * Description: Declares the health controller to expose liveness, readiness, and metadata endpoints.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
