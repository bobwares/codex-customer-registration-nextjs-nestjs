/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.module.ts
 * Version: 0.2.0
 * Turns: 3, 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: CustomerModule
 * Description: Registers customer domain repositories, controllers, and services for dependency injection.
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
import { CustomerController } from './controllers/customer.controller';

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
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
