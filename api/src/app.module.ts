/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.2.0
 * Turns: 1, 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: AppModule
 * Description: Defines the root NestJS application module that composes feature modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './database/data-source';
import { CustomerModule } from './customer/customer.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    HealthModule,
    CustomerModule,
  ],
})
export class AppModule {}
