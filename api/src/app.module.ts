/**
 * # App: Customer Registration API
 * # Package: api/src
 * # File: app.module.ts
 * # Version: 0.2.0
 * # Turns: 1,3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Description: Root NestJS module configuring configuration loading, logging infrastructure, and TypeORM connectivity.
 * #
 * # Classes
 * # - AppModule: Declares configuration providers, shared logging infrastructure, database integration, and global middleware bindings.
 */
import * as path from 'node:path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { CustomerModule } from './customer/customer.module';
import { JsonLogger } from './common/logging/json-logger.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { HealthModule } from './health/health.module';

const CONTEXT_ENV = path.resolve(__dirname, '..', '..', 'ai', 'context', '.env');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [CONTEXT_ENV, '.env'],
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('db.host'),
        port: config.get<number>('db.port', 5432),
        username: config.getOrThrow<string>('db.user'),
        password: config.getOrThrow<string>('db.pass'),
        database: config.getOrThrow<string>('db.name'),
        schema: config.get<string>('db.schema', 'public'),
        ssl: config.get<boolean>('db.ssl', false),
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: false,
        logging: false,
        autoLoadEntities: true,
        migrations: ['dist/migrations/*.js'],
      }),
    }),
    HealthModule,
    CustomerModule,
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
