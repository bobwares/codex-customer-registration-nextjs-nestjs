/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.module.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerModule
 * Description: Customer domain wiring module exporting controller and service with repository providers.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhone } from './entities/customer-phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerEmail, CustomerPhone, CustomerAddress])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
