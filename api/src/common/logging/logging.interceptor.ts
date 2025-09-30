/**
 * # App: Customer Registration API
 * # Package: api/src/common/logging
 * # File: logging.interceptor.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Global interceptor emitting structured request logs with correlation identifiers and latency.
 * #
 * # Classes
 * # - LoggingInterceptor: Wraps HTTP request handling to output structured success and error log entries.
 * #   - intercept: Measures execution, logs completion metadata, and forwards responses or errors.
 * #   - emit: Formats the structured payload and delegates logging to JsonLogger.
 */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { JsonLogger } from './json-logger.service';
import { RequestContext } from './request-context';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request & { originalUrl?: string }>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        this.emit(request.method, request.originalUrl ?? request.url, response.statusCode);
      }),
      catchError((error) => {
        const status = response.statusCode && response.statusCode >= 400 ? response.statusCode : 500;
        this.emit(request.method, request.originalUrl ?? request.url, status, error);
        return throwError(() => error);
      }),
    );
  }

  private emit(method: string, url: string, statusCode: number, error?: unknown): void {
    const ctx = RequestContext.get();
    const diff = ctx?.startHrTime ? process.hrtime(ctx.startHrTime) : undefined;
    const responseTimeMs = diff ? Math.round(diff[0] * 1_000 + diff[1] / 1_000_000) : undefined;

    const payload = {
      message: 'request',
      method,
      url,
      statusCode,
      responseTimeMs,
    };

    if (error instanceof Error) {
      this.logger.error({ ...payload, errorMessage: error.message }, error.stack, 'HTTP');
    } else {
      this.logger.log(payload, 'HTTP');
    }
  }
}
