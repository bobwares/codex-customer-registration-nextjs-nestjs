/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:01:03Z
 * Exports: CustomerModule
 * Description: NestJS module bundling the customer controller, service, and TypeORM entities.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './entities/customer.entity';
import { PostalAddressEntity } from './entities/postal-address.entity';
import { PrivacySettingsEntity } from './entities/privacy-settings.entity';
import { CustomerEmailEntity } from './entities/customer-email.entity';
import { CustomerPhoneNumberEntity } from './entities/customer-phone-number.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      PostalAddressEntity,
      PrivacySettingsEntity,
      CustomerEmailEntity,
      CustomerPhoneNumberEntity,
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
