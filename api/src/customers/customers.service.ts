/**
 * App: Customer Registration
 * Package: api/src/customers
 * File: customers.service.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: CustomersService
 * Description: Provides CRUD operations for managing customers using a
 *              TypeORM repository backed by PostgreSQL.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const entity = this.customersRepository.create(dto);
    return this.customersRepository.save(entity);
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);
    const updated = this.customersRepository.merge(customer, dto);
    return this.customersRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }
}
