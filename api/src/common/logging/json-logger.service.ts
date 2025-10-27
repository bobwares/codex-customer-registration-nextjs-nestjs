/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: json-logger.service.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: JsonLogger
 * Description: ConsoleLogger extension emitting structured JSON logs enriched with request context data.
 */
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { RequestContext } from './request-context';

type JsonLine = {
  timestamp: string;
  level: LogLevel;
  context?: string | undefined;
  message: string;
  requestId?: string | undefined;
  stack?: string | undefined;
  [key: string]: unknown;
};

const isJsonFormat = () => (process.env.LOG_FORMAT ?? 'json').toLowerCase() === 'json';

const invokeBase = (
  logger: ConsoleLogger,
  level: LogLevel,
  message: string,
  context?: string,
  stack?: string,
) => {
  const base = ConsoleLogger.prototype as unknown as Record<string, (...args: unknown[]) => void>;
  if (level === 'error') {
    base.error.call(logger, message, stack, context);
    return;
  }
  const method = level === 'log' ? 'log' : level;
  base[method]?.call(logger, message, context);
};

@Injectable()
export class JsonLogger extends ConsoleLogger {
  override setLogLevels(levels: LogLevel[]): void {
    super.setLogLevels(levels);
  }

  private write(
    level: LogLevel,
    message: unknown,
    context?: string,
    meta?: Record<string, unknown>,
    error?: unknown,
  ): void {
    const textMessage = typeof message === 'string' ? message : JSON.stringify(message);

    if (!isJsonFormat()) {
      invokeBase(this, level, textMessage, context, error instanceof Error ? error.stack : undefined);
      return;
    }

    const store = RequestContext.get();
    const line: JsonLine = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      requestId: store?.requestId,
      ...(meta ?? {}),
    };

    const stack =
      error instanceof Error
        ? error.stack
        : typeof (error as { stack?: unknown })?.stack === 'string'
          ? (error as { stack?: string }).stack
          : undefined;

    if (stack) {
      line.stack = stack;
    }

    process.stdout.write(`${JSON.stringify(line)}\n`);
  }

  override log(message: unknown, context?: string): void {
    this.write('log', message, context);
  }

  override error(message: unknown, stackOrContext?: string, context?: string): void {
    const hasStack = typeof context === 'string';
    const stack = hasStack ? stackOrContext : undefined;
    const derivedContext = hasStack ? context : stackOrContext;
    this.write('error', message, derivedContext, undefined, stack ? new Error(stack) : undefined);
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
}
