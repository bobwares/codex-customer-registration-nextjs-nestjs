/**
 * # App: Customer Registration
 * # Package: api.customers
 * # File: src/customers/customer.service.ts
 * # Version: 0.1.3
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:25:00Z
 * # Exports: CustomersService
 * # Description: Provides persistence-backed CRUD operations for the customer aggregate using TypeORM repositories.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomerDto, CustomerAddressDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhoneNumber } from './entities/customer-phone-number.entity';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal-address.entity';
import { PrivacySettings } from './entities/privacy-settings.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = new Customer();
    customer.customerId = createCustomerDto.id;
    customer.firstName = createCustomerDto.firstName;
    customer.middleName = createCustomerDto.middleName ?? null;
    customer.lastName = createCustomerDto.lastName;

    customer.postalAddress = this.mapAddress(createCustomerDto.address);
    customer.privacySettings = this.mapPrivacySettings(createCustomerDto.privacySettings);
    customer.emails = createCustomerDto.emails.map((email) => {
      const emailEntity = new CustomerEmail();
      emailEntity.email = email;
      emailEntity.customerId = customer.customerId;
      emailEntity.customer = { customerId: customer.customerId } as Customer;
      return emailEntity;
    });
    customer.phoneNumbers = (createCustomerDto.phoneNumbers ?? []).map((input) => {
      const phoneEntity = new CustomerPhoneNumber();
      phoneEntity.type = input.type;
      phoneEntity.number = input.number;
      phoneEntity.customerId = customer.customerId;
      phoneEntity.customer = { customerId: customer.customerId } as Customer;
      return phoneEntity;
    });

    await this.customerRepository.save(customer);

    return this.findOne(customer.customerId);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: {
        postalAddress: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { customerId: id },
      relations: {
        postalAddress: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found.`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (updateCustomerDto.firstName !== undefined) {
      customer.firstName = updateCustomerDto.firstName;
    }
    if (updateCustomerDto.middleName !== undefined) {
      customer.middleName = updateCustomerDto.middleName ?? null;
    }
    if (updateCustomerDto.lastName !== undefined) {
      customer.lastName = updateCustomerDto.lastName;
    }

    if (updateCustomerDto.address !== undefined) {
      customer.postalAddress = this.mapAddress(updateCustomerDto.address, customer.postalAddress ?? undefined);
    }

    if (updateCustomerDto.privacySettings !== undefined) {
      customer.privacySettings = this.mapPrivacySettings(
        updateCustomerDto.privacySettings,
        customer.privacySettings ?? undefined,
      );
    }

    const emailsToPersist = updateCustomerDto.emails;
    const phoneNumbersToPersist = updateCustomerDto.phoneNumbers;

    if (emailsToPersist !== undefined) {
      delete (customer as Partial<Customer>).emails;
    }
    if (phoneNumbersToPersist !== undefined) {
      delete (customer as Partial<Customer>).phoneNumbers;
    }

    await this.customerRepository.save(customer);

    const entityManager = this.customerRepository.manager;

    if (emailsToPersist !== undefined) {
      const emailRepository = entityManager.getRepository(CustomerEmail);
      await emailRepository.delete({ customerId: id });

      if (emailsToPersist.length > 0) {
        const emailEntities = emailsToPersist.map((email) =>
          emailRepository.create({ customerId: id, email }),
        );
        await emailRepository.save(emailEntities);
      }
    }

    if (phoneNumbersToPersist !== undefined) {
      const phoneRepository = entityManager.getRepository(CustomerPhoneNumber);
      await phoneRepository.delete({ customerId: id });

      const phoneInputs = phoneNumbersToPersist ?? [];
      if (phoneInputs.length > 0) {
        const phoneEntities = phoneInputs.map((phone) =>
          phoneRepository.create({ customerId: id, type: phone.type, number: phone.number }),
        );
        await phoneRepository.save(phoneEntities);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }

  private mapAddress(
    dto?: CustomerAddressDto,
    existing?: PostalAddress,
  ): PostalAddress | undefined {
    if (!dto) {
      return existing;
    }

    const address = existing ?? new PostalAddress();
    address.line1 = dto.line1;
    address.line2 = dto.line2 ?? null;
    address.city = dto.city;
    address.state = dto.state;
    address.postalCode = dto.postalCode ?? null;
    address.country = dto.country;
    return address;
  }

  private mapPrivacySettings(
    dto: { marketingEmailsEnabled: boolean; twoFactorEnabled: boolean },
    existing?: PrivacySettings,
  ): PrivacySettings {
    const settings = existing ?? new PrivacySettings();
    settings.marketingEmailsEnabled = dto.marketingEmailsEnabled;
    settings.twoFactorEnabled = dto.twoFactorEnabled;
    return settings;
  }
}
