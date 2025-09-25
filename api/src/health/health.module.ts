/**
 * App: Customer Registration
 * Package: api/src/health
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T19:06:09Z
 * Exports: HealthModule
 * Description: Declares the health check controller to expose application readiness and liveness endpoints.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
