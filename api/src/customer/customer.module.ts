/**
 * # App: Customer Registration API
 * # Package: api/src/customer
 * # File: customer.module.ts
 * # Version: 0.1.0
 * # Turns: 3
 * # Author: Codex Agent
 * # Date: 2025-09-30T17:20:00Z
 * # Exports: CustomerModule
 * # Description: Nest module wiring customer persistence services and database bindings.
 */
import { Module } from '@nestjs/common';
import { CustomerDatabaseModule } from './database/customer-database.module';
import { CustomerService } from './services/customer.service';

@Module({
  imports: [CustomerDatabaseModule],
  providers: [CustomerService],
  exports: [CustomerService, CustomerDatabaseModule],
})
export class CustomerModule {}
