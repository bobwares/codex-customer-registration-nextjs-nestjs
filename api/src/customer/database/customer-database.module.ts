/**
 * # App: Customer Registration API
 * # Package: api/src/customer/database
 * # File: customer-database.module.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerDatabaseModule
 * # Description: Provides TypeORM repository bindings for the customer domain entities.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CustomerEmailEntity,
  CustomerEntity,
  CustomerPhoneNumberEntity,
  PostalAddressEntity,
  PrivacySettingsEntity,
} from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerEntity,
      CustomerEmailEntity,
      CustomerPhoneNumberEntity,
      PostalAddressEntity,
      PrivacySettingsEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class CustomerDatabaseModule {}
