/**
 * App: Customer Registration
 * Package: api/src/common/interceptors
 * File: http-logging.interceptor.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: HttpLoggingInterceptor
 * Description: Emits structured request logs with correlation identifiers and latency metrics using the Pino logger.
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { performance } from 'node:perf_hooks';
import type { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

type RequestWithId = Request & { requestId?: string };

type ResponseWithStatus = Response & { statusCode?: number };

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  public constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HttpLoggingInterceptor.name);
  }

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithId>();
    const response = http.getResponse<ResponseWithStatus>();
    const start = performance.now();

    return next.handle().pipe(
      tap(() => {
        const duration = performance.now() - start;
        this.logger.info(
          {
            requestId: request.requestId,
            method: request.method,
            url: request.originalUrl ?? request.url,
            statusCode: response.statusCode ?? HttpLoggingInterceptor.getStatusCode(response),
            responseTimeMs: Number(duration.toFixed(2)),
          },
          'HTTP request completed',
        );
      }),
      catchError((error: Error & { status?: number }) => {
        const duration = performance.now() - start;
        this.logger.error(
          {
            requestId: request.requestId,
            method: request.method,
            url: request.originalUrl ?? request.url,
            statusCode: error.status ?? response.statusCode ?? 500,
            responseTimeMs: Number(duration.toFixed(2)),
            stack: error.stack,
          },
          error.message,
        );
        return throwError(() => error);
      }),
    );
  }

  private static getStatusCode(response: ResponseWithStatus): number {
    return response.statusCode ?? 200;
  }
}
