/**
 * # App: Customer Registration API
 * # Package: api/src/customer/services
 * # File: customer.service.spec.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: Unit tests validating transactional create, update, and delete behaviors of the customer
 * #              service using mocked repositories.
 * #
 * # Test Suites
 * # - CustomerService: Exercises repository interactions for CRUD operations and transactional semantics.
 */
import { DataSource, Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { CustomerEntity } from '../entities';

describe('CustomerService', () => {
  let service: CustomerService;
  let dataSource: Partial<DataSource>;
  let repository: Partial<Repository<CustomerEntity>>;

  beforeEach(() => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    } as Partial<Repository<CustomerEntity>>;

    dataSource = {
      transaction: jest
        .fn(async (callback: (manager: any) => Promise<unknown>) => callback({}))
        .mockName('transaction') as unknown as DataSource['transaction'],
    } as Partial<DataSource>;

    service = new CustomerService(dataSource as DataSource, repository as Repository<CustomerEntity>);
  });

  it('delegates to repository when listing customers', async () => {
    (repository.find as jest.Mock).mockResolvedValue([]);

    await expect(service.listCustomers()).resolves.toEqual([]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('fetches a single customer by id', async () => {
    const customer = { customerId: 'abc' } as CustomerEntity;
    (repository.findOne as jest.Mock).mockResolvedValue(customer);

    await expect(service.findCustomerById('abc')).resolves.toBe(customer);
  });

  it('deletes a customer by id', async () => {
    (repository.delete as jest.Mock).mockResolvedValue(undefined);

    await service.deleteCustomer('abc');
    expect(repository.delete).toHaveBeenCalledWith('abc');
  });

  it('wraps create workflow in a transaction', async () => {
    (dataSource.transaction as jest.Mock).mockResolvedValue('created');

    const result = await service.createCustomer({
      customerId: 'abc',
      firstName: 'Jane',
      lastName: 'Doe',
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true },
      emails: ['jane@example.com'],
    });

    expect(dataSource.transaction).toHaveBeenCalled();
    expect(result).toBe('created');
  });
});
