/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: json-logger.service.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:01:36Z
 * Exports: JsonLogger
 * Description: Logger service that emits structured JSON lines enriched with request context information.
 */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { RequestContext } from './request-context';

@Injectable()
export class JsonLogger extends ConsoleLogger {
  private isJsonFormat(): boolean {
    return (process.env.LOG_FORMAT ?? 'json').toLowerCase() === 'json';
  }

  public override log(message: any, context?: string): void {
    this.write('log', message, context);
  }

  public override error(message: any, stack?: string, context?: string): void {
    this.write('error', message, context, stack);
  }

  public override warn(message: any, context?: string): void {
    this.write('warn', message, context);
  }

  public override debug(message: any, context?: string): void {
    this.write('debug', message, context);
  }

  public override verbose(message: any, context?: string): void {
    this.write('verbose', message, context);
  }

  public configureLevels(level: LogLevel): void {
    const order: LogLevel[] = ['fatal', 'error', 'warn', 'log', 'debug', 'verbose'];
    const idx = order.indexOf(level);
    const fallback = order.indexOf('log');
    const sliceIndex = idx === -1 ? fallback + 1 : idx + 1;
    const levels = order.slice(0, sliceIndex) as LogLevel[];
    super.setLogLevels(levels);
  }

  private write(level: LogLevel, message: any, context?: string, stack?: string): void {
    if (!this.isJsonFormat()) {
      switch (level) {
        case 'error':
          super.error(message, stack, context);
          return;
        case 'warn':
          super.warn(message, context);
          return;
        case 'debug':
          super.debug(message, context);
          return;
        case 'verbose':
          super.verbose(message, context);
          return;
        default:
          super.log(message, context);
          return;
      }
    }

    const now = new Date().toISOString();
    const store = RequestContext.get();
    const payload: Record<string, unknown> = {
      timestamp: now,
      level,
      context,
      requestId: store?.requestId,
    };

    if (stack) {
      payload.stack = stack;
    }

    if (typeof message === 'object' && message !== null) {
      payload.message = message.message ?? 'structured';
      payload.meta = message;
    } else {
      payload.message = String(message);
    }

    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }
}
