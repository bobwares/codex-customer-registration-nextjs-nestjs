/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: json-logger.service.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:07:41Z
 * Exports: JsonLogger
 * Description: Implements a ConsoleLogger variant that emits JSON-formatted log lines enriched with request context metadata.
 */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { RequestContext } from './request-context';

type JsonLine = {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  requestId?: string;
  stack?: string;
  [key: string]: unknown;
};

const asString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value instanceof Error) {
    return value.message;
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  return JSON.stringify(value);
};

const useJsonFormat = (): boolean => (process.env.LOG_FORMAT ?? 'json').toLowerCase() === 'json';

@Injectable()
export class JsonLogger extends ConsoleLogger {
  private configuredLevels: LogLevel[] = ['error', 'warn', 'log'];

  override setLogLevels(levels: LogLevel[]): void {
    this.configuredLevels = levels;
    super.setLogLevels(levels);
  }

  override log(message: unknown, context?: string): void {
    this.write('log', message, context);
  }

  override error(message: unknown, stack?: string, context?: string): void {
    const derivedStack = stack ?? (message instanceof Error ? message.stack : undefined);
    this.write('error', message, context, derivedStack);
  }

  override warn(message: unknown, context?: string): void {
    this.write('warn', message, context);
  }

  override debug(message: unknown, context?: string): void {
    this.write('debug', message, context);
  }

  override verbose(message: unknown, context?: string): void {
    this.write('verbose', message, context);
  }

  private write(level: LogLevel, message: unknown, context?: string, stack?: string): void {
    if (!this.configuredLevels.includes(level)) {
      return;
    }

    if (useJsonFormat()) {
      const record = this.buildRecord(level, message, context, stack);
      process.stdout.write(`${JSON.stringify(record)}\n`);
      return;
    }

    switch (level) {
      case 'error':
        super.error(asString(message), stack, context);
        break;
      case 'warn':
        super.warn(asString(message), context);
        break;
      case 'debug':
        super.debug(asString(message), context);
        break;
      case 'verbose':
        super.verbose(asString(message), context);
        break;
      default:
        super.log(asString(message), context);
    }
  }

  private buildRecord(level: LogLevel, message: unknown, context?: string, stack?: string): JsonLine {
    const store = RequestContext.get();
    const base: JsonLine = {
      timestamp: new Date().toISOString(),
      level,
      message: '',
    };

    if (context) {
      base.context = context;
    }

    if (store?.requestId) {
      base.requestId = store.requestId;
    }

    if (stack) {
      base.stack = stack;
    }

    if (typeof message === 'object' && message !== null && !(message instanceof Error)) {
      const { message: innerMessage, msg, ...rest } = message as Record<string, unknown> & {
        message?: unknown;
        msg?: unknown;
      };
      base.message = asString(innerMessage ?? msg ?? 'structured');
      Object.assign(base, rest);
    } else {
      base.message = asString(message);
    }

    if (store?.startHrTime) {
      const diff = process.hrtime(store.startHrTime);
      base.responseTimeMs = Math.round(diff[0] * 1000 + diff[1] / 1_000_000);
    }

    return base;
  }
}
