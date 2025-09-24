/**
 * App: Customer Registration
 * Package: api
 * File: app.module.ts
 * Version: 0.4.0
 * Turns: 1,3,4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: AppModule
 * Description: Root NestJS application module integrating database connectivity and feature modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDataSourceOptions } from './database/data-source';
import { HealthModule } from './health/health.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [TypeOrmModule.forRoot(getDataSourceOptions()), HealthModule, CustomerModule],
})
export class AppModule {}
