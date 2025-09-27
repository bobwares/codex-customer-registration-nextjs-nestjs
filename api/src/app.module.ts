/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.2.0
 * Turns: 1, 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:02:19Z
 * Exports: AppModule
 * Description: Root NestJS module configuring configuration, persistence, logging, and feature modules.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { CustomerModule } from './customer/customer.module';
import { RequestIdMiddleware } from './common/logging/request-id.middleware';
import { JsonLogger } from './common/logging/json-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = (config.get<string>('NODE_ENV') ?? '').toLowerCase();
        if (env === 'test') {
          return {
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
          } as const;
        }
        const ssl = (config.get<string>('DB_SSL') ?? 'false').toLowerCase();
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST', 'localhost'),
          port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
          username: config.get<string>('DB_USERNAME', 'customer_service'),
          password: config.get<string>('DB_PASSWORD', 'customer_service'),
          database: config.get<string>('DB_NAME', 'customer_service'),
          schema: 'customer_domain',
          autoLoadEntities: true,
          synchronize: false,
          ssl: ssl === 'true' ? { rejectUnauthorized: false } : false,
        } as const;
      },
    }),
    HealthModule,
    CustomerModule,
  ],
  providers: [JsonLogger, RequestIdMiddleware],
  exports: [JsonLogger],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
