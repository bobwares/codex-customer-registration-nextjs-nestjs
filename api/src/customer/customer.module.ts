/**
 * App: Customer Registration
 * Package: api
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: CustomerModule
 * Description: Aggregates customer domain providers, repositories, and controllers.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal_address.entity';
import { PrivacySettings } from './entities/privacy_settings.entity';
import { CustomerEmail } from './entities/customer_email.entity';
import { CustomerPhoneNumber } from './entities/customer_phone_number.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      PostalAddress,
      PrivacySettings,
      CustomerEmail,
      CustomerPhoneNumber,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
