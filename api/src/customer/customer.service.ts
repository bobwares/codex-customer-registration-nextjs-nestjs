/**
 * App: Customer Registration
 * Package: api
 * File: customer.service.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: CustomerService
 * Description: Provides repository-backed CRUD operations for the customer domain aggregate.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { AddressDto } from './dtos/address.dto';
import { PrivacySettingsDto } from './dtos/privacy-settings.dto';
import { PhoneNumberDto } from './dtos/phone-number.dto';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal_address.entity';
import { PrivacySettings } from './entities/privacy_settings.entity';
import { CustomerEmail } from './entities/customer_email.entity';
import { CustomerPhoneNumber } from './entities/customer_phone_number.entity';

export type CustomerResponse = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  address: AddressDto;
  privacySettings: PrivacySettingsDto;
  emails: string[];
  phoneNumbers: PhoneNumberDto[];
};

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(PostalAddress)
    private readonly postalAddressRepository: Repository<PostalAddress>,
    @InjectRepository(PrivacySettings)
    private readonly privacySettingsRepository: Repository<PrivacySettings>,
    @InjectRepository(CustomerEmail)
    private readonly customerEmailRepository: Repository<CustomerEmail>,
    @InjectRepository(CustomerPhoneNumber)
    private readonly customerPhoneRepository: Repository<CustomerPhoneNumber>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerResponse> {
    const address = await this.saveAddress(dto.address);
    const privacy = await this.savePrivacy(dto.privacySettings);

    const customerEntity = this.customerRepository.create({
      customer_id: dto.id,
      first_name: dto.firstName,
      middle_name: dto.middleName ?? null,
      last_name: dto.lastName,
      address,
      privacySettings: privacy,
    });

    const savedCustomer = await this.customerRepository.save(customerEntity);

    await this.replaceEmails(savedCustomer, dto.emails);
    await this.replacePhones(savedCustomer, dto.phoneNumbers);

    return this.mapCustomer(await this.loadCustomerOrFail(savedCustomer.customer_id));
  }

  async findAll(): Promise<CustomerResponse[]> {
    const customers = await this.customerRepository.find({
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
    });
    return customers.map((customer) => this.mapCustomer(customer));
  }

  async findOne(id: string): Promise<CustomerResponse> {
    const customer = await this.loadCustomer(id);
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return this.mapCustomer(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerResponse> {
    const customer = await this.loadCustomerOrFail(id);

    if (dto.firstName !== undefined) {
      customer.first_name = dto.firstName;
    }
    if (dto.middleName !== undefined) {
      customer.middle_name = dto.middleName ?? null;
    }
    if (dto.lastName !== undefined) {
      customer.last_name = dto.lastName;
    }

    if (dto.address) {
      customer.address = await this.saveAddress(dto.address, customer.address ?? undefined);
    }

    if (dto.privacySettings) {
      customer.privacySettings = await this.savePrivacy(
        dto.privacySettings,
        customer.privacySettings ?? undefined,
      );
    }

    await this.customerRepository.save(customer);

    if (dto.emails) {
      await this.replaceEmails(customer, dto.emails);
    }

    if (dto.phoneNumbers) {
      await this.replacePhones(customer, dto.phoneNumbers);
    }

    return this.mapCustomer(await this.loadCustomerOrFail(id));
  }

  async remove(id: string): Promise<void> {
    const customer = await this.loadCustomerOrFail(id);
    const addressId = customer.address?.postal_address_id;
    const privacyId = customer.privacySettings?.privacy_settings_id;

    await this.customerRepository.remove(customer);

    if (addressId) {
      await this.postalAddressRepository.delete(addressId);
    }
    if (privacyId) {
      await this.privacySettingsRepository.delete(privacyId);
    }
  }

  private async loadCustomer(id: string): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { customer_id: id },
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
      order: {
        emails: { customer_email_id: 'ASC' },
        phoneNumbers: { customer_phone_number_id: 'ASC' },
      },
    });
  }

  private async loadCustomerOrFail(id: string): Promise<Customer> {
    const customer = await this.loadCustomer(id);
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return customer;
  }

  private mapCustomer(customer: Customer): CustomerResponse {
    const address = customer.address ?? new PostalAddress();
    const privacy = customer.privacySettings ?? new PrivacySettings();

    const addressDto: AddressDto = {
      line1: address.line1 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      postalCode: address.postal_code ?? '',
      country: address.country ?? '',
    };
    if (address.line2 != null && address.line2 !== '') {
      addressDto.line2 = address.line2;
    }

    const response: CustomerResponse = {
      id: customer.customer_id,
      firstName: customer.first_name,
      lastName: customer.last_name,
      address: addressDto,
      privacySettings: {
        marketingEmailsEnabled: Boolean(privacy.marketing_emails_enabled),
        twoFactorEnabled: Boolean(privacy.two_factor_enabled),
      },
      emails: (customer.emails ?? []).map((email) => email.email),
      phoneNumbers: (customer.phoneNumbers ?? []).map((phone) => ({
        type: phone.type as PhoneNumberDto['type'],
        number: phone.number,
      })),
    };
    if (customer.middle_name !== undefined) {
      response.middleName = customer.middle_name;
    }

    return response;
  }

  private async saveAddress(dto: AddressDto, entity?: PostalAddress): Promise<PostalAddress> {
    const target = entity ?? new PostalAddress();
    target.line1 = dto.line1;
    target.line2 = dto.line2 ?? null;
    target.city = dto.city;
    target.state = dto.state;
    target.postal_code = dto.postalCode;
    target.country = dto.country;
    return this.postalAddressRepository.save(target);
  }

  private async savePrivacy(
    dto: PrivacySettingsDto,
    entity?: PrivacySettings,
  ): Promise<PrivacySettings> {
    const target = entity ?? new PrivacySettings();
    target.marketing_emails_enabled = dto.marketingEmailsEnabled;
    target.two_factor_enabled = dto.twoFactorEnabled;
    return this.privacySettingsRepository.save(target);
  }

  private async replaceEmails(customer: Customer, emails: string[]): Promise<void> {
    await this.customerEmailRepository.delete({ customer_id: customer.customer_id });
    const records = emails.map((email) =>
      this.customerEmailRepository.create({ customer, email }),
    );
    if (records.length > 0) {
      await this.customerEmailRepository.save(records);
    }
  }

  private async replacePhones(customer: Customer, phones: PhoneNumberDto[]): Promise<void> {
    await this.customerPhoneRepository.delete({ customer_id: customer.customer_id });
    const records = phones.map((phone) =>
      this.customerPhoneRepository.create({ customer, type: phone.type, number: phone.number }),
    );
    if (records.length > 0) {
      await this.customerPhoneRepository.save(records);
    }
  }
}
