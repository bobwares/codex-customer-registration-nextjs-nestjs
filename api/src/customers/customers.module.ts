/**
 * App: Customer Registration
 * Package: api/src/customers
 * File: customers.module.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: CustomersModule
 * Description: Declares the Customers module, providing controllers and
 *              services for managing persisted customer records.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
