/**
 * App: Customer Registration
 * Package: api/src/common/filters
 * File: http-exception.filter.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: HttpExceptionFilter
 * Description: Formats thrown exceptions into the standardized Problem Details envelope and logs structured error events.
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { ProblemDetailsDto } from '../dtos/problem-details.dto';

type RequestWithId = Request & { requestId?: string };

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  public constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<RequestWithId>();
    const response = context.getResponse<Response>();

    const problem = this.buildProblemDetails(exception, request);

    this.logger.error(
      {
        requestId: problem.requestId,
        path: problem.path,
        statusCode: problem.statusCode,
        error: problem.error,
        message: problem.message,
      },
      Array.isArray(problem.message) ? problem.message.join(', ') : problem.message,
    );

    response.status(problem.statusCode).json(problem);
  }

  private buildProblemDetails(exception: unknown, request: RequestWithId): ProblemDetailsDto {
    const timestamp = new Date().toISOString();
    const base: ProblemDetailsDto = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred.',
      path: request.originalUrl ?? request.url,
      timestamp,
    };

    if (request.requestId) {
      base.requestId = request.requestId;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as
        | string
        | { error?: string; message?: string | string[]; statusCode?: number };
      const message = typeof response === 'string' ? response : response.message ?? exception.message;
      const error = typeof response === 'string' ? exception.name : response.error ?? exception.name;

      return {
        ...base,
        statusCode: status,
        error,
        message,
      };
    }

    return base;
  }
}
