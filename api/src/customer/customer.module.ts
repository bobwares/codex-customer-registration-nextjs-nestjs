/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: 3
 * Author: Codex Agent
 * Date: 2025-09-25T19:36:06Z
 * Exports: CustomerModule
 * Description: Registers customer domain repositories and services for dependency injection.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { CustomerEmailEntity } from './entities/customer_email.entity';
import { CustomerPhoneNumberEntity } from './entities/customer_phone_number.entity';
import { CustomerProfileView } from './entities/customer_profile_view.entity';
import { PostalAddressEntity } from './entities/postal_address.entity';
import { PrivacySettingsEntity } from './entities/privacy_settings.entity';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostalAddressEntity,
      PrivacySettingsEntity,
      CustomerEntity,
      CustomerEmailEntity,
      CustomerPhoneNumberEntity,
      CustomerProfileView,
    ]),
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
