/**
 * App: Customer Registration
 * Package: api/src/customers
 * File: customers.service.spec.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: (test suite)
 * Description: Unit tests ensuring the CustomersService coordinates with the
 *              repository to perform CRUD operations.
 */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, PrivacySettingsDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

const basePrivacy: PrivacySettingsDto = {
  marketingEmailsEnabled: true,
  twoFactorEnabled: true,
};

const createCustomerDto: CreateCustomerDto = {
  id: '68a25fdc-9d4a-4d31-8dbe-582214a9f6c3',
  firstName: 'Ada',
  lastName: 'Lovelace',
  emails: ['ada@example.com'],
  privacySettings: basePrivacy,
};

function createRepositoryMock(): jest.Mocked<Partial<Repository<Customer>>> {
  return {
    create: jest.fn((input?: Partial<Customer>) => ({ ...input } as Customer)),
    save: jest.fn(async (entity: Partial<Customer>) => entity as Customer),
    find: jest.fn(async () => []),
    findOne: jest.fn(),
    merge: jest.fn((target: Customer, source: Partial<Customer>) => ({
      ...target,
      ...source,
    } as Customer)),
    remove: jest.fn(),
  } as unknown as jest.Mocked<Partial<Repository<Customer>>>;
}

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<Partial<Repository<Customer>>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: createRepositoryMock(),
        },
      ],
    }).compile();

    service = moduleRef.get(CustomersService);
    repository = moduleRef.get(getRepositoryToken(Customer));
  });

  it('creates a customer', async () => {
    const result = await service.create(createCustomerDto);

    expect(repository.create).toHaveBeenCalledWith(createCustomerDto);
    expect(repository.save).toHaveBeenCalledWith(createCustomerDto);
    expect(result).toEqual(createCustomerDto);
  });

  it('finds all customers', async () => {
    await service.findAll();
    expect(repository.find).toHaveBeenCalled();
  });

  it('throws when a customer is not found', async () => {
    repository.findOne = jest.fn().mockResolvedValue(undefined);

    await expect(service.findOne(createCustomerDto.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates a customer', async () => {
    const existing = { ...createCustomerDto } as Customer;
    repository.findOne = jest.fn().mockResolvedValue(existing);

    const result = await service.update(createCustomerDto.id, { firstName: 'Grace' });

    expect(repository.merge).toHaveBeenCalledWith(existing, { firstName: 'Grace' });
    expect(repository.save).toHaveBeenCalledWith({ ...existing, firstName: 'Grace' });
    expect(result.firstName).toEqual('Grace');
  });

  it('removes a customer', async () => {
    const existing = { ...createCustomerDto } as Customer;
    repository.findOne = jest.fn().mockResolvedValue(existing);

    await service.remove(createCustomerDto.id);
    expect(repository.remove).toHaveBeenCalledWith(existing);
  });
});
