/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-id.middleware.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:01:10Z
 * Exports: RequestIdMiddleware
 * Description: Express middleware that ensures every request has an X-Request-Id header and seeds the request context store.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  public use(req: Request, _res: Response, next: NextFunction): void {
    const existing = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    req.headers['x-request-id'] = existing;

    const start = process.hrtime.bigint();
    RequestContext.run({ requestId: existing, startTime: start }, () => next());
  }
}
