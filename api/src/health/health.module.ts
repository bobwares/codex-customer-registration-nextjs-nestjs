/**
 * App: Customer Registration
 * Package: api
 * File: health.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T22:00:25Z
 * Exports: HealthModule
 * Description: Declares the health module that exposes liveness and readiness controllers for the API.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
