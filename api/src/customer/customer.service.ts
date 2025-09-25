/**
 * App: Customer Registration
 * Package: api
 * File: customer.service.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: CustomerService
 * Description: Provides transactional CRUD operations for customer entities and
 *              maps persisted data to DTO responses.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal-address.entity';
import { PrivacySettings } from './entities/privacy-settings.entity';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhoneNumber } from './entities/customer-phone-number.entity';
import { CreateCustomerDto, PhoneNumberDto, PostalAddressDto, PrivacySettingsDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerResponseDto } from './dtos/customer-response.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const id = dto.id ?? randomUUID();
    const entity = await this.dataSource.transaction(async (manager) => {
      const customer = manager.getRepository(Customer).create({
        id,
        firstName: dto.firstName,
        middleName: dto.middleName ?? null,
        lastName: dto.lastName,
      });

      customer.privacySettings = manager.getRepository(PrivacySettings).create({
        marketingEmailsEnabled: dto.privacySettings.marketingEmailsEnabled,
        twoFactorEnabled: dto.privacySettings.twoFactorEnabled,
      });

      customer.address = dto.address
        ? manager.getRepository(PostalAddress).create({
            line1: dto.address.line1,
            line2: dto.address.line2 ?? null,
            city: dto.address.city,
            state: dto.address.state,
            postalCode: dto.address.postalCode,
            country: dto.address.country,
          })
        : null;

      customer.emails = dto.emails.map((email) =>
        manager.getRepository(CustomerEmail).create({ email, customerId: id }),
      );

      customer.phoneNumbers = dto.phoneNumbers.map((phone) =>
        manager.getRepository(CustomerPhoneNumber).create({
          customerId: id,
          type: phone.type,
          number: phone.number,
        }),
      );

      return manager.getRepository(Customer).save(customer);
    });

    return this.toResponse(entity);
  }

  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.find({
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return customers.map((customer) => this.toResponse(customer));
  }

  async findOne(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: {
        address: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
    });
    if (!customer) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    return this.toResponse(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const updated = await this.dataSource.transaction(async (manager) => {
      const customerRepo = manager.getRepository(Customer);
      const customer = await customerRepo.findOne({
        where: { id },
        relations: {
          address: true,
          privacySettings: true,
          emails: true,
          phoneNumbers: true,
        },
      });
      if (!customer) {
        throw new NotFoundException(`Customer ${id} not found`);
      }

      if (dto.firstName !== undefined) {
        customer.firstName = dto.firstName;
      }
      if (dto.middleName !== undefined) {
        customer.middleName = dto.middleName ?? null;
      }
      if (dto.lastName !== undefined) {
        customer.lastName = dto.lastName;
      }

      if (dto.privacySettings) {
        customer.privacySettings.marketingEmailsEnabled =
          dto.privacySettings.marketingEmailsEnabled;
        customer.privacySettings.twoFactorEnabled = dto.privacySettings.twoFactorEnabled;
      }

      if (dto.address !== undefined) {
        if (dto.address === null) {
          customer.address = null;
        } else if (customer.address) {
          customer.address.line1 = dto.address.line1;
          customer.address.line2 = dto.address.line2 ?? null;
          customer.address.city = dto.address.city;
          customer.address.state = dto.address.state;
          customer.address.postalCode = dto.address.postalCode;
          customer.address.country = dto.address.country;
        } else {
          customer.address = manager.getRepository(PostalAddress).create({
            line1: dto.address.line1,
            line2: dto.address.line2 ?? null,
            city: dto.address.city,
            state: dto.address.state,
            postalCode: dto.address.postalCode,
            country: dto.address.country,
          });
        }
      }

      if (dto.emails) {
        await manager
          .getRepository(CustomerEmail)
          .createQueryBuilder()
          .delete()
          .where('customer_id = :id', { id })
          .execute();
        customer.emails = dto.emails.map((email) =>
          manager.getRepository(CustomerEmail).create({
            email,
            customerId: id,
          }),
        );
      }

      if (dto.phoneNumbers) {
        await manager
          .getRepository(CustomerPhoneNumber)
          .createQueryBuilder()
          .delete()
          .where('customer_id = :id', { id })
          .execute();
        customer.phoneNumbers = dto.phoneNumbers.map((phone) =>
          manager.getRepository(CustomerPhoneNumber).create({
            customerId: id,
            type: phone.type,
            number: phone.number,
          }),
        );
      }

      await customerRepo.save(customer);
      return customer;
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
  }

  private toResponse(customer: Customer): CustomerResponseDto {
    const response = new CustomerResponseDto();
    response.id = customer.id;
    response.firstName = customer.firstName;
    response.middleName = customer.middleName ?? null;
    response.lastName = customer.lastName;
    response.emails = (customer.emails ?? []).map((email) => email.email);
    response.phoneNumbers = (customer.phoneNumbers ?? []).map((phone) => this.mapPhone(phone));
    response.address = customer.address ? this.mapAddress(customer.address) : null;
    response.privacySettings = this.mapPrivacy(customer.privacySettings);
    return response;
  }

  private mapPhone(phone: CustomerPhoneNumber): PhoneNumberDto {
    return {
      type: phone.type,
      number: phone.number,
    };
  }

  private mapAddress(address: PostalAddress): PostalAddressDto {
    const result: PostalAddressDto = {
      line1: address.line1,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };
    if (address.line2) {
      result.line2 = address.line2;
    }
    return result;
  }

  private mapPrivacy(privacy: PrivacySettings): PrivacySettingsDto {
    return {
      marketingEmailsEnabled: privacy.marketingEmailsEnabled,
      twoFactorEnabled: privacy.twoFactorEnabled,
    };
  }
}
