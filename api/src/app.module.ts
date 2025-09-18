/**
 * # App: Customer Registration
 * # Package: api.core
 * # File: src/app.module.ts
 * # Version: 0.1.2
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:54:05Z
 * # Exports: AppModule
 * # Description: Root NestJS module configuring configuration management, database access, and feature modules.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configValidationSchema } from './config/config.schema';
import { AppConfig, configuration } from './config/configuration';
import { CustomersModule } from './customers/customers.module';
import { createOrmConfig } from './ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => createOrmConfig(configService),
    }),
    CustomersModule,
  ],
})
export class AppModule {}
