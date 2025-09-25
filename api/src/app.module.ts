/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.3.0
 * Turns: 1, 3, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: AppModule
 * Description: Defines the root NestJS application module that composes feature modules and global middleware.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { CustomerModule } from './customer/customer.module';
import { HealthModule } from './health/health.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    LoggingModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    HealthModule,
    CustomerModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
