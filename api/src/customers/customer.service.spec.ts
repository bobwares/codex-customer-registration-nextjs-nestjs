/**
 * # App: Customer Registration
 * # Package: api.customers.tests
 * # File: src/customers/customer.service.spec.ts
 * # Version: 0.2.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:25:00Z
 * # Exports: (test suite)
 * # Description: Validates CustomersService behaviour using mocked repositories to ensure CRUD flows mutate customer aggregates correctly.
 */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhoneNumber } from './entities/customer-phone-number.entity';
import { Customer } from './entities/customer.entity';
import { PostalAddress } from './entities/postal-address.entity';
import { PrivacySettings } from './entities/privacy-settings.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: jest.Mocked<Repository<Customer>>;
  let emailRepository: { delete: jest.Mock; save: jest.Mock; create: jest.Mock };
  let phoneRepository: { delete: jest.Mock; save: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(CustomersService);
    repository = moduleRef.get(getRepositoryToken(Customer));

    emailRepository = {
      delete: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn((entity) => entity),
    };
    phoneRepository = {
      delete: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      create: jest.fn((entity) => entity),
    };

    (repository as unknown as { manager: { getRepository: jest.Mock } }).manager = {
      getRepository: jest.fn((entity) => {
        if (entity === CustomerEmail) {
          return emailRepository;
        }
        if (entity === CustomerPhoneNumber) {
          return phoneRepository;
        }
        throw new Error(`Unexpected repository request: ${entity}`);
      }),
    };

    jest.clearAllMocks();
  });

  it('creates a new customer aggregate with relations', async () => {
    const dto: CreateCustomerDto = {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      firstName: 'Ada',
      middleName: 'Lovelace',
      lastName: 'Byron',
      emails: ['ada@example.com'],
      phoneNumbers: [
        {
          type: 'mobile',
          number: '+15555551234',
        },
      ],
      address: {
        line1: '10 Downing St',
        city: 'London',
        state: 'LDN',
        postalCode: 'SW1A 2AA',
        country: 'GB',
      },
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: false,
      },
    };

    const persisted = new Customer();
    repository.save.mockImplementation(async (customer) => customer as Customer);
    repository.findOne.mockResolvedValueOnce(persisted);

    const result = await service.create(dto);

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedCustomer = repository.save.mock.calls[0][0];
    expect(savedCustomer.customerId).toBe(dto.id);
    expect(savedCustomer.emails).toBeDefined();
    expect(savedCustomer.emails ?? []).toHaveLength(1);
    expect(savedCustomer.emails?.[0]).toBeInstanceOf(CustomerEmail);
    expect(savedCustomer.phoneNumbers).toBeDefined();
    expect(savedCustomer.phoneNumbers ?? []).toHaveLength(1);
    expect(savedCustomer.phoneNumbers?.[0]).toBeInstanceOf(CustomerPhoneNumber);
    expect(savedCustomer.postalAddress).toBeInstanceOf(PostalAddress);
    expect(savedCustomer.privacySettings).toBeInstanceOf(PrivacySettings);
    expect(result).toBe(persisted);
  });

  it('returns all customers with relations eager loaded', async () => {
    const customers = [new Customer()];
    repository.find.mockResolvedValue(customers);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({
      relations: {
        postalAddress: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    expect(result).toBe(customers);
  });

  it('returns a single customer when found', async () => {
    const customer = new Customer();
    repository.findOne.mockResolvedValue(customer);

    const result = await service.findOne('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

    expect(repository.findOne).toHaveBeenCalledWith({
      where: { customerId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
      relations: {
        postalAddress: true,
        privacySettings: true,
        emails: true,
        phoneNumbers: true,
      },
    });
    expect(result).toBe(customer);
  });

  it('throws NotFoundException when customer does not exist', async () => {
    repository.findOne.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates mutable fields and persists the aggregate', async () => {
    const existing = new Customer();
    existing.customerId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
    existing.postalAddress = new PostalAddress();
    existing.privacySettings = new PrivacySettings();
    const updated = Object.assign(new Customer(), existing);
    repository.findOne.mockResolvedValueOnce(existing);
    repository.findOne.mockResolvedValueOnce(updated);
    repository.save.mockImplementation(async (customer) => customer as Customer);

    const updateDto: UpdateCustomerDto = {
      firstName: 'Grace',
      middleName: 'Hopper',
      lastName: 'Admiral',
      emails: ['grace@example.com'],
      phoneNumbers: [
        {
          type: 'home',
          number: '+15555550000',
        },
      ],
      address: {
        line1: '1700 Post St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94115',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: false,
        twoFactorEnabled: true,
      },
    };

    const result = await service.update(existing.customerId, updateDto);

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedCustomer = repository.save.mock.calls[0][0];
    expect(savedCustomer.firstName).toBe('Grace');
    expect(savedCustomer.middleName).toBe('Hopper');
    expect(savedCustomer.lastName).toBe('Admiral');
    expect('emails' in savedCustomer).toBe(false);
    expect('phoneNumbers' in savedCustomer).toBe(false);
    expect(savedCustomer.postalAddress?.city).toBe('San Francisco');
    expect(savedCustomer.privacySettings?.twoFactorEnabled).toBe(true);

    expect(repository.manager?.getRepository).toHaveBeenCalledWith(CustomerEmail);
    expect(repository.manager?.getRepository).toHaveBeenCalledWith(CustomerPhoneNumber);
    expect(emailRepository.delete).toHaveBeenCalledWith({ customerId: existing.customerId });
    expect(emailRepository.save).toHaveBeenCalledWith([
      { customerId: existing.customerId, email: 'grace@example.com' },
    ]);
    expect(phoneRepository.delete).toHaveBeenCalledWith({ customerId: existing.customerId });
    expect(phoneRepository.save).toHaveBeenCalledWith([
      { customerId: existing.customerId, type: 'home', number: '+15555550000' },
    ]);
    expect(result).toBe(updated);
  });

  it('removes a customer after successful lookup', async () => {
    const customer = new Customer();
    repository.findOne.mockResolvedValue(customer);

    await service.remove('dddddddd-dddd-dddd-dddd-dddddddddddd');

    expect(repository.remove).toHaveBeenCalledWith(customer);
  });
});
