/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: AppModule
 * Description: Root NestJS module configuring global configuration loading and validation.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { HealthModule } from './health/health.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { LoggingInterceptor } from './common/logging/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      validationSchema,
    }),
    HealthModule,
  ],
  providers: [
    JsonLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [JsonLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
