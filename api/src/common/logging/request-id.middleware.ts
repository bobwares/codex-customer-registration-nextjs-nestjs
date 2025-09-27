/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-id.middleware.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:02:17Z
 * Exports: RequestIdMiddleware
 * Description: Ensures each inbound request contains an X-Request-Id header and seeds the async request context store.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const existing = req.headers['x-request-id'];
    const requestId = typeof existing === 'string' && existing.length > 0 ? existing : randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    const start = process.hrtime();
    RequestContext.run({ requestId, startHrTime: start }, next);
  }
}
