/**
 * App: Customer Registration
 * Package: api
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerModule
 * Description: Aggregates customer domain components and registers TypeORM
 *              repositories for dependency injection.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhoneNumber } from './entities/customer-phone-number.entity';
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
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
