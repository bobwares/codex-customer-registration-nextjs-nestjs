/**
 * # App: Customer Registration API
 * # Package: api/src/health
 * # File: health.module.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Declares the health monitoring module exposing service status endpoints.
 * #
 * # Classes
 * # - HealthModule: Registers the HealthController for availability probes.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
