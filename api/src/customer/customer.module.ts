/**
 * # App: Customer Registration API
 * # Package: api/src/customer
 * # File: customer.module.ts
 * # Version: 0.2.0
 * # Turns: 3,4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Exports: CustomerModule
 * # Description: Nest module wiring customer persistence services, controller, and database bindings.
 */
import { Module } from '@nestjs/common';
import { CustomerDatabaseModule } from './database/customer-database.module';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controllers/customer.controller';

@Module({
  imports: [CustomerDatabaseModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService, CustomerDatabaseModule],
})
export class CustomerModule {}
