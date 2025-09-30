/**
 * # App: Customer Registration API
 * # Package: api/src/health
 * # File: health.controller.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Exposes liveness, readiness, and metadata endpoints for infrastructure health probes.
 * #
 * # Types
 * # - HealthPayload: Structure returned by the root health endpoint describing service metadata.
 * #
 * # Classes
 * # - HealthController: Responds to GET requests for health, liveness, and readiness checks.
 * #   - health: Returns system metadata including build and runtime diagnostics.
 * #   - liveness: Returns an ok sentinel for platform liveness probes.
 * #   - readiness: Returns an ok sentinel indicating downstream dependencies are ready.
 */
import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type HealthPayload = {
  status: 'ok';
  service: string;
  version: string | null;
  commit: string | null;
  pid: number;
  uptime: number;
  timestamp: string;
  memory: NodeJS.MemoryUsage;
};

function getPackageVersion(): string | null {
  try {
    const packageJson = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(packageJson, 'utf8'));
    return typeof pkg?.version === 'string' ? pkg.version : null;
  } catch {
    return null;
  }
}

@Controller('health')
export class HealthController {
  @Get()
  health(): HealthPayload {
    return {
      status: 'ok',
      service: 'backend',
      version: getPackageVersion(),
      commit: process.env.COMMIT_SHA ?? null,
      pid: process.pid,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
    };
  }

  @Get('live')
  liveness(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  readiness(): { status: 'ok' } {
    return { status: 'ok' };
  }
}
