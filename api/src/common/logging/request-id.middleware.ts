/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-id.middleware.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: RequestIdMiddleware
 * Description: Middleware ensuring each request carries an X-Request-Id and seeding the request context store.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    req.headers['x-request-id'] = requestId;
    const start: [number, number] = process.hrtime();
    RequestContext.run({ requestId, startHrTime: start }, next);
  }
}
