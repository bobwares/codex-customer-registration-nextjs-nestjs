/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.service.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: CustomerService
 * Description: Encapsulates customer persistence operations using TypeORM repositories.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhone } from './entities/customer-phone.entity';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerEmail)
    private readonly emailRepository: Repository<CustomerEmail>,
    @InjectRepository(CustomerPhone)
    private readonly phoneRepository: Repository<CustomerPhone>,
    @InjectRepository(CustomerAddress)
    private readonly addressRepository: Repository<CustomerAddress>
  ) {}

  async create(dto: CreateCustomerDto): Promise<CustomerDto> {
    const customer = this.customerRepository.create({
      id: dto.id,
      firstName: dto.firstName,
      middleName: dto.middleName,
      lastName: dto.lastName,
      marketingEmailsEnabled: dto.privacySettings.marketingEmailsEnabled,
      twoFactorEnabled: dto.privacySettings.twoFactorEnabled,
    });
    await this.customerRepository.save(customer);

    const emailEntities = dto.emails.map((email) =>
      this.emailRepository.create({ customerId: dto.id, email })
    );
    await this.emailRepository.save(emailEntities);

    const phoneEntities = dto.phoneNumbers?.map((phone) =>
      this.phoneRepository.create({
        customerId: dto.id,
        phoneType: phone.type,
        phoneNumber: phone.number,
      })
    );
    if (phoneEntities?.length) {
      await this.phoneRepository.save(phoneEntities);
    }

    if (dto.address) {
      const addressEntity = this.addressRepository.create({
        customerId: dto.id,
        ...dto.address,
      });
      await this.addressRepository.save(addressEntity);
    }

    return this.findOne(dto.id);
  }

  async findAll(): Promise<CustomerDto[]> {
    const customers = await this.customerRepository.find({
      relations: ['emails', 'phones', 'address'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return customers.map((customer) => CustomerDto.fromEntity(customer));
  }

  async findOne(id: string): Promise<CustomerDto> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['emails', 'phones', 'address'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return CustomerDto.fromEntity(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDto> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const merged = this.customerRepository.merge(customer, {
      firstName: dto.firstName ?? customer.firstName,
      middleName: dto.middleName ?? customer.middleName,
      lastName: dto.lastName ?? customer.lastName,
      marketingEmailsEnabled:
        dto.privacySettings?.marketingEmailsEnabled ?? customer.marketingEmailsEnabled,
      twoFactorEnabled:
        dto.privacySettings?.twoFactorEnabled ?? customer.twoFactorEnabled,
    });
    await this.customerRepository.save(merged);

    if (dto.emails) {
      await this.emailRepository.delete({ customerId: id });
      const emailEntities = dto.emails.map((email) =>
        this.emailRepository.create({ customerId: id, email })
      );
      await this.emailRepository.save(emailEntities);
    }

    if (dto.phoneNumbers) {
      await this.phoneRepository.delete({ customerId: id });
      const phoneEntities = dto.phoneNumbers.map((phone) =>
        this.phoneRepository.create({
          customerId: id,
          phoneType: phone.type,
          phoneNumber: phone.number,
        })
      );
      await this.phoneRepository.save(phoneEntities);
    }

    if (dto.address) {
      await this.addressRepository.delete({ customerId: id });
      const addressEntity = this.addressRepository.create({ customerId: id, ...dto.address });
      await this.addressRepository.save(addressEntity);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
  }
}
