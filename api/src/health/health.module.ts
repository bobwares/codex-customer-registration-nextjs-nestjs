/**
 * # App: Customer Registration API
 * # Package: api.src.health
 * # File: health.module.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: Declares the HealthModule that bundles the health controller and makes the routes available to
 * #              the application for liveness, readiness, and metadata checks.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
