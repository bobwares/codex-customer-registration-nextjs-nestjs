/**
 * App: Customer Registration
 * Package: api
 * File: app.module.ts
 * Version: 0.2.0
 * Turns: 1-4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: AppModule
 * Description: Root NestJS module wiring the database layer, health module,
 *              and customer domain feature set.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { CustomerModule } from './customer/customer.module';
import { getDataSourceOptions } from './database/data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => getDataSourceOptions(),
    }),
    HealthModule,
    CustomerModule,
  ],
})
export class AppModule {}
