/**
 * # App: Customer Registration API
 * # Package: api/src/common/logging
 * # File: request-id.middleware.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Middleware ensuring every HTTP request carries an X-Request-Id header and seeded AsyncLocalStorage context.
 * #
 * # Classes
 * # - RequestIdMiddleware: Generates or propagates request IDs and records the high-resolution start time.
 * #   - use: Applies the request context, attaches the header, and advances the middleware chain.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContext } from './request-context';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const header = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    req.headers['x-request-id'] = header;
    res.setHeader('X-Request-Id', header);

    const start: [number, number] = process.hrtime();
    RequestContext.run({ requestId: header, startHrTime: start }, () => {
      next();
    });
  }
}
