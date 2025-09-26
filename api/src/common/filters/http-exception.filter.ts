/**
 * App: Customer Registration
 * Package: api/src/common/filters
 * File: http-exception.filter.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:02:02Z
 * Exports: HttpExceptionFilter
 * Description: Exception filter returning standardized problem details envelopes with logging integration.
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JsonLogger } from '../logging/json-logger.service';
import { RequestContext } from '../logging/request-context';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public constructor(private readonly logger: JsonLogger) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, error, details } = this.normalizeException(exception);
    const store = RequestContext.get();

    const payload = {
      statusCode,
      error,
      message,
      path: request.originalUrl ?? request.url,
      timestamp: new Date().toISOString(),
      requestId: store?.requestId,
    };

    if (details) {
      (payload as Record<string, unknown>).details = details;
    }

    if (exception instanceof Error) {
      this.logger.error(payload, exception.stack, 'HttpExceptionFilter');
    } else {
      this.logger.error(payload, undefined, 'HttpExceptionFilter');
    }

    response.status(statusCode).json(payload);
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    message: string | string[];
    error: string;
    details?: unknown;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return { statusCode: status, message: response, error: exception.name };
      }
      if (typeof response === 'object' && response !== null) {
        const body = response as Record<string, unknown>;
        const message = (body.message as string | string[] | undefined) ?? exception.message;
        const error = (body.error as string | undefined) ?? exception.name;
        return {
          statusCode: status,
          message: message ?? 'An error occurred',
          error,
          details: body.details,
        };
      }
      return { statusCode: status, message: exception.message, error: exception.name };
    }

    if (exception instanceof Error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred',
      error: 'InternalServerError',
    };
  }
}
