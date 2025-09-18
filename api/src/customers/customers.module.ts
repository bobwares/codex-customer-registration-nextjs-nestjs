/**
 * # App: Customer Registration
 * # Package: api.customers
 * # File: src/customers/customers.module.ts
 * # Version: 0.1.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:47:41Z
 * # Exports: CustomersModule
 * # Description: NestJS feature module composing controllers, services, and entities for customer management.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customer.controller';
import { CustomersService } from './customer.service';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhoneNumber } from './entities/customer-phone-number.entity';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal-address.entity';
import { PrivacySettings } from './entities/privacy-settings.entity';

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
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
