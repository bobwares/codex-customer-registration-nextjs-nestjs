/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer.controller.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerController
 * Description: REST controller exposing CRUD endpoints for the customer domain, transforming
 *              entities into DTO-friendly responses.
 */
import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';

export interface CustomerResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers: { type: string; number: string }[];
  address?: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  privacySettings: {
    marketingEmailsEnabled: boolean;
    twoFactorEnabled: boolean;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponse> {
    const customer = await this.customerService.create(dto);
    return this.toResponse(customer);
  }

  @Get()
  async findAll(): Promise<CustomerResponse[]> {
    const customers = await this.customerService.findAll();
    return customers.map((customer) => this.toResponse(customer));
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<CustomerResponse> {
    const customer = await this.customerService.findOne(id);
    return this.toResponse(customer);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponse> {
    const customer = await this.customerService.update(id, dto);
    return this.toResponse(customer);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): Promise<void> {
    await this.customerService.remove(id);
  }

  private toResponse(customer: Customer): CustomerResponse {
    return {
      id: customer.id,
      firstName: customer.firstName,
      middleName: customer.middleName ?? undefined,
      lastName: customer.lastName,
      emails: (customer.emails ?? []).map((email: CustomerEmail) => email.email),
      phoneNumbers: (customer.phoneNumbers ?? []).map((phone: CustomerPhoneNumber) => ({
        type: phone.type,
        number: phone.number,
      })),
      address: customer.address
        ? this.mapAddress(customer.address)
        : null,
      privacySettings: customer.privacySettings
        ? this.mapPrivacy(customer.privacySettings)
        : null,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  private mapAddress(address: PostalAddress): CustomerResponse['address'] {
    return {
      line1: address.line1,
      line2: address.line2 ?? undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };
  }

  private mapPrivacy(privacy: PrivacySettings): CustomerResponse['privacySettings'] {
    return {
      marketingEmailsEnabled: privacy.marketingEmailsEnabled,
      twoFactorEnabled: privacy.twoFactorEnabled,
    };
  }
}
