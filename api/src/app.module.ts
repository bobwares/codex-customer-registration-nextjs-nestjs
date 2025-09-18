/**
 * App: Customer Registration
 * Package: api
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: AppModule
 * Description: Root NestJS module configuring global providers such as configuration and
 *              database access, and registering the customer domain module.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './config/database.config';
import { buildTypeOrmOptions, DatabaseConfig } from './config/typeorm.config';
import { CustomerModule } from './customers/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfig) => buildTypeOrmOptions(config),
    }),
    CustomerModule,
  ],
})
export class AppModule {}
