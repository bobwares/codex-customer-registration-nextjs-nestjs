/**
 * App: Customer Registration
 * Package: api.customers
 * File: customer.service.ts
 * Version: 0.1.1
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: CustomerService
 * Description: Provides business operations for managing customers, orchestrating TypeORM
 *              repositories to persist aggregate changes.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { CreateCustomerDto, PostalAddressDto, PrivacySettingsDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { Customer } from './customer.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerEmail)
    private readonly emailRepository: Repository<CustomerEmail>,
    @InjectRepository(CustomerPhoneNumber)
    private readonly phoneRepository: Repository<CustomerPhoneNumber>,
    @InjectRepository(PostalAddress)
    private readonly addressRepository: Repository<PostalAddress>,
    @InjectRepository(PrivacySettings)
    private readonly privacyRepository: Repository<PrivacySettings>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create();
    if (dto.id) {
      customer.id = dto.id;
    }

    this.mapScalarFields(customer, dto);
    customer.address = dto.address ? await this.resolveAddress(dto.address) : null;
    customer.privacySettings = await this.resolvePrivacySettings(dto.privacySettings);
    customer.emails = dto.emails.map((email) => this.emailRepository.create({ email }));
    customer.phoneNumbers = (dto.phoneNumbers ?? []).map((phone) =>
      this.phoneRepository.create({ type: phone.type, number: phone.number }),
    );

    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    this.mapScalarFields(customer, dto);

    if (dto.address !== undefined) {
      customer.address = dto.address ? await this.resolveAddress(dto.address) : null;
    }

    if (dto.privacySettings) {
      customer.privacySettings = await this.resolvePrivacySettings(dto.privacySettings);
    }

    if (dto.emails) {
      customer.emails = dto.emails.map((email) => this.emailRepository.create({ email }));
    }

    if (dto.phoneNumbers) {
      customer.phoneNumbers = dto.phoneNumbers.map((phone) =>
        this.phoneRepository.create({ type: phone.type, number: phone.number }),
      );
    }

    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  private mapScalarFields(target: Customer, dto: Partial<CreateCustomerDto>): void {
    if (dto.firstName !== undefined) {
      target.firstName = dto.firstName;
    }
    if (dto.middleName !== undefined) {
      target.middleName = dto.middleName;
    }
    if (dto.lastName !== undefined) {
      target.lastName = dto.lastName;
    }
  }

  private async resolveAddress(addressDto: PostalAddressDto): Promise<PostalAddress> {
    const existing = await this.addressRepository.findOne({
      where: {
        line1: addressDto.line1,
        line2: addressDto.line2 ? addressDto.line2 : IsNull(),
        city: addressDto.city,
        state: addressDto.state,
        postalCode: addressDto.postalCode,
        country: addressDto.country,
      },
    });
    if (existing) {
      return existing;
    }
    return this.addressRepository.save(
      this.addressRepository.create({
        line1: addressDto.line1,
        line2: addressDto.line2 ?? null,
        city: addressDto.city,
        state: addressDto.state,
        postalCode: addressDto.postalCode,
        country: addressDto.country,
      }),
    );
  }

  private async resolvePrivacySettings(
    privacyDto: PrivacySettingsDto,
  ): Promise<PrivacySettings> {
    const existing = await this.privacyRepository.findOne({
      where: {
        marketingEmailsEnabled: privacyDto.marketingEmailsEnabled,
        twoFactorEnabled: privacyDto.twoFactorEnabled,
      },
    });
    if (existing) {
      return existing;
    }
    return this.privacyRepository.save(
      this.privacyRepository.create({
        marketingEmailsEnabled: privacyDto.marketingEmailsEnabled,
        twoFactorEnabled: privacyDto.twoFactorEnabled,
      }),
    );
  }
}
