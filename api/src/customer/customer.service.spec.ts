/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.service.spec.ts
 * Version: 0.1.1
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Description: Verifies customer service orchestrates repositories to create and retrieve customers.
 */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { CustomerEmail } from './entities/customer-email.entity';
import { CustomerPhone } from './entities/customer-phone.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CustomerDto } from './dto/customer.dto';

const uuid = '11111111-1111-1111-1111-111111111111';

type RepositoryMock<T> = {
  create: jest.Mock;
  save: jest.Mock;
  find?: jest.Mock;
  findOne?: jest.Mock;
  delete?: jest.Mock;
  merge?: jest.Mock;
};

function createRepositoryMock<T>(): RepositoryMock<T> {
  return {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  };
}

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: RepositoryMock<Customer>;
  let emailRepository: RepositoryMock<CustomerEmail>;
  let phoneRepository: RepositoryMock<CustomerPhone>;
  let addressRepository: RepositoryMock<CustomerAddress>;

  beforeEach(async () => {
    customerRepository = createRepositoryMock<Customer>();
    emailRepository = createRepositoryMock<CustomerEmail>();
    phoneRepository = createRepositoryMock<CustomerPhone>();
    addressRepository = createRepositoryMock<CustomerAddress>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: getRepositoryToken(Customer), useValue: customerRepository },
        { provide: getRepositoryToken(CustomerEmail), useValue: emailRepository },
        { provide: getRepositoryToken(CustomerPhone), useValue: phoneRepository },
        { provide: getRepositoryToken(CustomerAddress), useValue: addressRepository },
      ],
    }).compile();

    service = moduleRef.get(CustomerService);
  });

  describe('findOne', () => {
    it('throws when customer does not exist', async () => {
      customerRepository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(uuid)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('persists and returns a new customer', async () => {
      const dto: CreateCustomerDto = {
        id: uuid,
        firstName: 'Alice',
        lastName: 'Johnson',
        emails: ['alice@example.com'],
        phoneNumbers: [{ type: 'mobile', number: '+15550000000' }],
        address: {
          line1: '123 Elm St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          country: 'US',
        },
        privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true },
      };

      const persistedCustomer = {
        id: dto.id,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        marketingEmailsEnabled: dto.privacySettings.marketingEmailsEnabled,
        twoFactorEnabled: dto.privacySettings.twoFactorEnabled,
        emails: [],
        phones: [],
      } as unknown as Customer;

      customerRepository.create.mockReturnValue(persistedCustomer);
      customerRepository.save.mockResolvedValue(persistedCustomer);

      const expected: CustomerDto = {
        id: dto.id,
        firstName: dto.firstName,
        middleName: null,
        lastName: dto.lastName,
        emails: dto.emails,
        phoneNumbers: dto.phoneNumbers ?? [],
        address: dto.address ?? null,
        privacySettings: dto.privacySettings,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expected);

      const actual = await service.create(dto);

      expect(customerRepository.create).toHaveBeenCalledWith({
        id: dto.id,
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName: dto.lastName,
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      });
      expect(emailRepository.save).toHaveBeenCalled();
      expect(phoneRepository.save).toHaveBeenCalled();
      expect(addressRepository.save).toHaveBeenCalled();
      expect(actual).toEqual(expected);
    });
  });
});
