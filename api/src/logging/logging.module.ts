/**
 * App: Customer Registration
 * Package: api/src/logging
 * File: logging.module.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: LoggingModule
 * Description: Configures the NestJS application-wide structured logger with request-scoped metadata and interceptors.
 */
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import type { Params } from 'nestjs-pino';
import { HttpLoggingInterceptor } from '../common/interceptors/http-logging.interceptor';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (): Params => {
        const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'development' ? 'debug' : 'info');
        const pretty = process.env.PRETTY_LOGS === 'true';
        return {
          pinoHttp: {
            level,
            autoLogging: false,
            ...(pretty
              ? {
                  transport: {
                    target: 'pino-pretty',
                    options: { colorize: true, singleLine: true },
                  },
                }
              : {}),
          },
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
