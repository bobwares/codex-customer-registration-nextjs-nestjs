/**
 * App: Customer Registration
 * Package: api/src/common/middleware
 * File: request-id.middleware.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: RequestIdMiddleware
 * Description: Ensures every inbound HTTP request has a correlation identifier propagated through logs and responses.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

type RequestWithId = Request & { requestId?: string };

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private static readonly HEADER_NAME = 'x-request-id';

  public use(req: RequestWithId, res: Response, next: NextFunction): void {
    const incoming = (req.headers[RequestIdMiddleware.HEADER_NAME] as string | undefined)?.toString();
    const requestId = incoming && incoming.trim().length > 0 ? incoming : randomUUID();

    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    next();
  }
}
