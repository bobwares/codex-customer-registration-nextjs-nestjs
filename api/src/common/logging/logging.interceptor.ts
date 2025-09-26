/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: logging.interceptor.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:01:49Z
 * Exports: LoggingInterceptor
 * Description: Global interceptor that emits structured request/response log entries with latency and correlation identifiers.
 */
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Request } from 'express';
import { JsonLogger } from './json-logger.service';
import { RequestContext } from './request-context';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  public constructor(private readonly logger: JsonLogger) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<{ statusCode?: number }>();

    return next.handle().pipe(
      tap(() => {
        this.emitLog(request, response.statusCode ?? HttpStatus.OK);
      }),
      catchError((error) => {
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        this.emitLog(request, status, error);
        return throwError(() => error);
      }),
    );
  }

  private emitLog(request: Request, statusCode: number, error?: unknown): void {
    const store = RequestContext.get();
    const elapsedMs = store ? Number(process.hrtime.bigint() - store.startTime) / 1_000_000 : undefined;
    const meta = {
      event: 'http_request',
      method: request.method,
      url: request.originalUrl ?? request.url,
      statusCode,
      responseTimeMs: elapsedMs,
    };

    if (error instanceof Error) {
      this.logger.error(meta, error.stack, 'HTTP');
    } else {
      this.logger.log(meta, 'HTTP');
    }
  }
}
