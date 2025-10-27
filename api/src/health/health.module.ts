/**
 * App: Customer Registration
 * Package: api/src/health
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: HealthModule
 * Description: Health module registering the health controller for liveness and readiness probes.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
