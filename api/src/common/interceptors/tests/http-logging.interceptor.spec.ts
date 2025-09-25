/**
 * App: Customer Registration
 * Package: api/src/common/interceptors/tests
 * File: http-logging.interceptor.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: (none)
 * Description: Validates that the HTTP logging interceptor emits structured log entries with the request identifier.
 */
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of, throwError } from 'rxjs';
import type { PinoLogger } from 'nestjs-pino';
import { HttpLoggingInterceptor } from '../http-logging.interceptor';

describe('HttpLoggingInterceptor', () => {
  it('logs successful responses with the request identifier', async () => {
    const logger = createLoggerMock();
    const interceptor = new HttpLoggingInterceptor(logger);
    const context = createHttpContext({ requestId: 'abc-123' });
    const handler: CallHandler = { handle: () => of({}) };

    await lastValueFrom(interceptor.intercept(context, handler));

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'abc-123', method: 'GET', url: '/customers' }),
      'HTTP request completed',
    );
  });

  it('logs errors and preserves the request identifier', async () => {
    const logger = createLoggerMock();
    const interceptor = new HttpLoggingInterceptor(logger);
    const context = createHttpContext({ requestId: 'xyz-789' });
    const handler: CallHandler = {
      handle: () => throwError(() => Object.assign(new Error('Failure'), { status: 503 })),
    };

    await expect(lastValueFrom(interceptor.intercept(context, handler))).rejects.toThrow('Failure');

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ requestId: 'xyz-789', statusCode: 503 }),
      'Failure',
    );
  });
});

function createLoggerMock(): jest.Mocked<PinoLogger> {
  const logger: Partial<jest.Mocked<PinoLogger>> = {
    setContext: jest.fn(),
    assign: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    info: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };
  return logger as jest.Mocked<PinoLogger>;
}

function createHttpContext(options: { requestId: string }): ExecutionContext {
  return {
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', url: '/customers', originalUrl: '/customers', requestId: options.requestId }),
      getResponse: () => ({ statusCode: 200 }),
    }),
  } as unknown as ExecutionContext;
}
