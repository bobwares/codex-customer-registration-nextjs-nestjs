/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: AppModule
 * Description: Root application module that wires configuration, TypeORM
 *              database access, and the Customers module into the NestJS app.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { dataSourceOptions } from './database/database.config';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...dataSourceOptions, autoLoadEntities: true }),
    }),
    CustomersModule,
  ],
})
export class AppModule {}
