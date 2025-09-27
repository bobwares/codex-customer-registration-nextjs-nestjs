/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: logging.interceptor.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:02:17Z
 * Exports: LoggingInterceptor
 * Description: Captures HTTP request lifecycle metrics and emits structured log records including response metadata.
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JsonLogger } from './json-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request & { originalUrl?: string }>();
    const response = http.getResponse<{ statusCode?: number }>();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          {
            message: 'request',
            method: request.method,
            url: request.originalUrl ?? request.url,
            statusCode: response.statusCode ?? 200,
          },
          'HTTP',
        );
      }),
      catchError((error) => {
        const statusCode = response.statusCode ?? (typeof (error as any)?.status === 'number' ? (error as any).status : 500);
        this.logger.error(
          {
            message: 'request',
            method: request.method,
            url: request.originalUrl ?? request.url,
            statusCode,
          },
          error instanceof Error ? error.stack : undefined,
          'HTTP',
        );
        return throwError(() => error);
      }),
    );
  }
}
