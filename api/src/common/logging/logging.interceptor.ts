/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: logging.interceptor.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: LoggingInterceptor
 * Description: Global interceptor emitting structured request logs including latency and request identifiers.
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RequestContext } from './request-context';
import { JsonLogger } from './json-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: JsonLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { originalUrl?: string }>();
    const res = http.getResponse<{ statusCode?: number }>();

    return next.handle().pipe(
      tap(() => {
        this.emit(req.method, req.originalUrl ?? req.url, res.statusCode ?? 200);
      }),
      catchError((err) => {
        this.emit(req.method, req.originalUrl ?? req.url, res.statusCode ?? 500, err);
        return throwError(() => err);
      }),
    );
  }

  private emit(method: string, url: string, statusCode: number, err?: unknown): void {
    const store = RequestContext.get();
    const elapsed = store?.startHrTime
      ? (() => {
          const diff = process.hrtime(store.startHrTime);
          return diff[0] * 1000 + Math.round(diff[1] / 1_000_000);
        })()
      : undefined;

    const meta = {
      msg: 'request',
      method,
      url,
      statusCode,
      responseTimeMs: elapsed,
    };

    if (err instanceof Error) {
      this.logger.error('Request failed', err.stack, 'HTTP');
      this.logger.log(meta, 'HTTP');
    } else {
      this.logger.log(meta, 'HTTP');
    }
  }
}
