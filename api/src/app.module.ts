/**
 * App: Customer Registration
 * Package: api/src
 * File: app.module.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: AppModule
 * Description: Root NestJS module wiring configuration, database connection, and customer domain.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './customer/entities/customer.entity';
import { CustomerAddress } from './customer/entities/customer-address.entity';
import { CustomerEmail } from './customer/entities/customer-email.entity';
import { CustomerPhone } from './customer/entities/customer-phone.entity';
import { CustomerModule } from './customer/customer.module';
import configuration from './customer/infrastructure/configuration';
import validationSchema from './customer/infrastructure/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'customer_registration',
        synchronize: false,
        entities: [Customer, CustomerEmail, CustomerPhone, CustomerAddress],
      }),
    }),
    CustomerModule,
  ],
})
export class AppModule {}
