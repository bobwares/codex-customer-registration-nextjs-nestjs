/**
 * # App: Customer Registration API
 * # Package: api/src/customer/controllers
 * # File: customer.controller.spec.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: Unit tests verifying the customer controller orchestrates CRUD flows and error handling in
 * #              concert with the customer service.
 * #
 * # Test Suites
 * # - CustomerController: Covers list, read, create, update, and delete scenarios with success and 404 cases.
 */
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from '../services/customer.service';
import { CustomerEntity } from '../entities';

const createCustomerEntity = (overrides: Partial<CustomerEntity> = {}): CustomerEntity => ({
  customerId: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a',
  firstName: 'Jane',
  middleName: 'Q',
  lastName: 'Doe',
  emails: [],
  phoneNumbers: [],
  address: null,
  privacySettings: {
    privacySettingsId: 1,
    marketingEmailsEnabled: true,
    twoFactorEnabled: true,
    customers: [],
  },
  addressId: null,
  privacySettingsId: 1,
  ...overrides,
});

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            listCustomers: jest.fn(),
            findCustomerById: jest.fn(),
            createCustomer: jest.fn(),
            updateCustomerProfile: jest.fn(),
            deleteCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(CustomerController);
    service = moduleRef.get(CustomerService) as jest.Mocked<CustomerService>;
  });

  it('lists customers', async () => {
    service.listCustomers.mockResolvedValue([
      createCustomerEntity({
        emails: [
          {
            emailId: 1,
            email: 'jane.doe@example.com',
            customerId: '1',
            customer: undefined as never,
          } as unknown as CustomerEntity['emails'][number],
        ],
        phoneNumbers: [
          {
            phoneId: 1,
            type: 'mobile',
            number: '+15558675309',
            customerId: '1',
            customer: undefined as never,
          } as unknown as CustomerEntity['phoneNumbers'][number],
        ],
      }),
    ]);

    const result = await controller.listCustomers();

    expect(result).toEqual([
      expect.objectContaining({
        id: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a',
        emails: ['jane.doe@example.com'],
        phoneNumbers: [{ type: 'mobile', number: '+15558675309' }],
      }),
    ]);
  });

  it('returns a single customer', async () => {
    service.findCustomerById.mockResolvedValue(createCustomerEntity());

    const result = await controller.getCustomer('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a');

    expect(result).toEqual(
      expect.objectContaining({
        id: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a',
        firstName: 'Jane',
      }),
    );
  });

  it('throws NotFound for missing customer', async () => {
    service.findCustomerById.mockResolvedValue(null);

    await expect(controller.getCustomer('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a customer', async () => {
    service.createCustomer.mockResolvedValue(createCustomerEntity());

    const result = await controller.createCustomer({
      id: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a',
      firstName: 'Jane',
      lastName: 'Doe',
      middleName: 'Q',
      emails: ['jane.doe@example.com'],
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true },
    });

    expect(service.createCustomer).toHaveBeenCalledWith(
      expect.objectContaining({ customerId: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' }),
    );
    expect(result).toEqual(expect.objectContaining({ id: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a' }));
  });

  it('updates a customer', async () => {
    service.updateCustomerProfile.mockResolvedValue(createCustomerEntity({ firstName: 'Janet' }));

    const result = await controller.updateCustomer('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a', {
      firstName: 'Janet',
    });

    expect(service.updateCustomerProfile).toHaveBeenCalledWith('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a', expect.any(Object));
    expect(result.firstName).toBe('Janet');
  });

  it('deletes a customer', async () => {
    service.findCustomerById.mockResolvedValue(createCustomerEntity());

    await controller.deleteCustomer('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a');

    expect(service.deleteCustomer).toHaveBeenCalledWith('8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a');
  });
});
