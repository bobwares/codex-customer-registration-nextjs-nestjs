/**
 * App: Customer Registration
 * Package: api
 * File: customer.service.spec.ts
 * Version: 0.2.1
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:42:51Z
 * Exports: (tests)
 * Description: Exercises CustomerService behaviour using mocked repositories and
 *              data source transactions.
 */
import { DataSource } from 'typeorm';
import { CustomerService } from '../customer.service';
import { Customer } from '../entities/customer.entity';
import { PostalAddress } from '../entities/postal-address.entity';
import { PrivacySettings } from '../entities/privacy-settings.entity';
import { CustomerEmail } from '../entities/customer-email.entity';
import { CustomerPhoneNumber } from '../entities/customer-phone-number.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';

function createDeleteChain() {
  const queryBuilder = {
    delete: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  return queryBuilder;
}

function createServiceMocks() {
  const customerRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn((entity: Partial<Customer>) => ({ ...entity })),
  };
  const addressRepo = { create: jest.fn((entity: Partial<PostalAddress>) => ({ ...entity })) };
  const privacyRepo = { create: jest.fn((entity: Partial<PrivacySettings>) => ({ ...entity })) };
  const emailRepo = {
    create: jest.fn((entity: Partial<CustomerEmail>) => ({ ...entity })),
    createQueryBuilder: jest.fn(() => createDeleteChain()),
  };
  const phoneRepo = {
    create: jest.fn((entity: Partial<CustomerPhoneNumber>) => ({ ...entity })),
    createQueryBuilder: jest.fn(() => createDeleteChain()),
  };
  const repoMap = new Map<any, any>([
    [Customer, customerRepo],
    [PostalAddress, addressRepo],
    [PrivacySettings, privacyRepo],
    [CustomerEmail, emailRepo],
    [CustomerPhoneNumber, phoneRepo],
  ]);
  const dataSource = {
    transaction: jest.fn(async (work: (manager: { getRepository: (entity: any) => any }) => any) => {
      return work({
        getRepository: (entity: any) => {
          const repo = repoMap.get(entity);
          if (!repo) {
            throw new Error(`Unexpected repository request for ${entity.name ?? entity}`);
          }
          return repo;
        },
      });
    }),
  } as unknown as DataSource;

  return {
    customerRepo,
    addressRepo,
    privacyRepo,
    emailRepo,
    phoneRepo,
    dataSource,
  };
}

describe('CustomerService', () => {
  const dto: CreateCustomerDto = {
    firstName: 'Alice',
    middleName: 'B',
    lastName: 'Smith',
    emails: ['alice@example.com'],
    phoneNumbers: [{ type: 'mobile', number: '+15555550101' }],
    address: {
      line1: '10 Main St',
      city: 'Austin',
      state: 'TX',
      postalCode: '73301',
      country: 'US',
    },
    privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
  };

  it('creates a customer and maps the response', async () => {
    const { customerRepo, addressRepo, privacyRepo, emailRepo, phoneRepo, dataSource } = createServiceMocks();
    addressRepo.create.mockReturnValue({ line1: dto.address?.line1 } as PostalAddress);
    privacyRepo.create.mockReturnValue({
      marketingEmailsEnabled: true,
      twoFactorEnabled: false,
    } as PrivacySettings);
    emailRepo.create.mockImplementation(({ email }) => ({ email: email! } as CustomerEmail));
    phoneRepo.create.mockImplementation(({ type, number }) => ({
      type: type!,
      number: number!,
    } as CustomerPhoneNumber));
    const savedEntity = {
      id: '11111111-1111-1111-1111-111111111111',
      firstName: 'Alice',
      middleName: 'B',
      lastName: 'Smith',
      address: { line1: dto.address?.line1, city: 'Austin', state: 'TX', postalCode: '73301', country: 'US' },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
      emails: [{ email: 'alice@example.com' }],
      phoneNumbers: [{ type: 'mobile', number: '+15555550101' }],
    } as unknown as Customer;
    customerRepo.save.mockResolvedValue(savedEntity);

    const service = new CustomerService(customerRepo as any, dataSource);
    const result = await service.create(dto);

    expect(customerRepo.save).toHaveBeenCalled();
    expect(result).toMatchObject({
      firstName: 'Alice',
      lastName: 'Smith',
      emails: ['alice@example.com'],
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    });
  });

  it('updates a customer', async () => {
    const { customerRepo, emailRepo, phoneRepo, privacyRepo, dataSource } = createServiceMocks();
    const existing = {
      id: '11111111-1111-1111-1111-111111111111',
      firstName: 'Alice',
      middleName: null,
      lastName: 'Smith',
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
      emails: [],
      phoneNumbers: [],
      address: null,
    } as unknown as Customer;
    customerRepo.findOne.mockResolvedValue(existing);
    privacyRepo.create.mockImplementation(() => existing.privacySettings);
    emailRepo.create.mockImplementation(({ email }) => ({ email: email! } as CustomerEmail));
    phoneRepo.create.mockImplementation(({ type, number }) => ({
      type: type!,
      number: number!,
    } as CustomerPhoneNumber));
    customerRepo.save.mockImplementation(async () => existing);

    const service = new CustomerService(customerRepo as any, dataSource);
    const updated = await service.update(existing.id, {
      firstName: 'Alice',
      emails: ['new@example.com'],
      phoneNumbers: [{ type: 'home', number: '+15555550102' }],
      privacySettings: { marketingEmailsEnabled: false, twoFactorEnabled: true },
    });

    expect(updated.emails).toEqual(['new@example.com']);
    expect(updated.privacySettings.twoFactorEnabled).toBe(true);
    expect(emailRepo.create).toHaveBeenCalled();
    expect(phoneRepo.create).toHaveBeenCalled();
  });

  it('removes a customer', async () => {
    const { customerRepo, dataSource } = createServiceMocks();
    customerRepo.delete.mockResolvedValue({ affected: 1 });
    const service = new CustomerService(customerRepo as any, dataSource);
    await expect(service.remove('11111111-1111-1111-1111-111111111111')).resolves.toBeUndefined();
    expect(customerRepo.delete).toHaveBeenCalledWith('11111111-1111-1111-1111-111111111111');
  });

  it('throws when customer missing during update', async () => {
    const { customerRepo, dataSource } = createServiceMocks();
    customerRepo.findOne.mockResolvedValue(null);
    const service = new CustomerService(customerRepo as any, dataSource);
    await expect(service.update('missing', {})).rejects.toThrow('not found');
  });
});
