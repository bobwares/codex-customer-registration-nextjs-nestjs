/**
 * App: Customer Registration
 * Package: api
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: HealthModule
 * Description: Registers the health check controller to expose service health
 *              probes without additional providers.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
