/**
 * App: Customer Registration
 * Package: api
 * File: health.controller.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: HealthController
 * Description: Exposes health check endpoints that report basic service metadata,
 *              including liveness and readiness probes for operational monitoring.
 */
import { Controller, Get } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type HealthPayload = {
  status: 'ok';
  service: string;
  version: string | null;
  commit: string | null;
  pid: number;
  uptime: number;
  timestamp: string;
  memory: NodeJS.MemoryUsage;
};

function getPkgVersion(): string | null {
  try {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
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
      version: getPkgVersion(),
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
