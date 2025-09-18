/**
 * # App: Customer Registration
 * # Package: api.customers
 * # File: src/customers/customer.controller.ts
 * # Version: 0.1.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:47:41Z
 * # Exports: CustomersController
 * # Description: REST controller exposing CRUD endpoints for managing customer profiles.
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.customersService.remove(id);
  }
}
