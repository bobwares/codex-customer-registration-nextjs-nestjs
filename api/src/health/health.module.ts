/**
 * App: Customer Registration
 * Package: api/src/health
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-26T02:55:41Z
 * Exports: HealthModule
 * Description: Declares the health check module that bundles health-related controllers for service monitoring.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
