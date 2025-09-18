/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerModule
 * Description: Declares the NestJS module bundling customer controllers, services, and TypeORM
 *              repositories.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Customer } from './customer.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      CustomerEmail,
      CustomerPhoneNumber,
      PostalAddress,
      PrivacySettings,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
