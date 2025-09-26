/**
 * App: Customer Registration
 * Package: api/src/customer/tests
 * File: customer.service.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:03:38Z
 * Exports: none
 * Description: Unit tests validating CustomerService CRUD workflows with an in-memory SQLite database.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from '../customer.service';
import { CustomerModule } from '../customer.module';
import { CustomerEntity } from '../entities/customer.entity';
import { PostalAddressEntity } from '../entities/postal-address.entity';
import { PrivacySettingsEntity } from '../entities/privacy-settings.entity';
import { CustomerEmailEntity } from '../entities/customer-email.entity';
import { CustomerPhoneNumberEntity } from '../entities/customer-phone-number.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

const baseCustomer: CreateCustomerDto = {
  firstName: 'Jane',
  middleName: 'A.',
  lastName: 'Doe',
  emails: ['jane@example.com'],
  phoneNumbers: [
    {
      type: 'mobile',
      number: '+15551234567',
    },
  ],
  address: {
    line1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    country: 'US',
  },
  privacySettings: {
    marketingEmailsEnabled: true,
    twoFactorEnabled: true,
  },
};

describe('CustomerService', () => {
  let moduleRef: TestingModule;
  let service: CustomerService;
  let repository: Repository<CustomerEntity>;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [
            CustomerEntity,
            PostalAddressEntity,
            PrivacySettingsEntity,
            CustomerEmailEntity,
            CustomerPhoneNumberEntity,
          ],
          synchronize: true,
        }),
        CustomerModule,
      ],
    }).compile();

    service = moduleRef.get(CustomerService);
    repository = moduleRef.get(getRepositoryToken(CustomerEntity));
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('creates and retrieves a customer', async () => {
    const created = await service.create(baseCustomer);
    expect(created.id).toBeDefined();
    expect(created.emails).toEqual(['jane@example.com']);

    const found = await service.findOne(created.id);
    expect(found.firstName).toBe('Jane');
    expect(found.address?.city).toBe('Springfield');
  });

  it('updates a customer record', async () => {
    const created = await service.create(baseCustomer);
    const update: UpdateCustomerDto = {
      firstName: 'Janet',
      emails: ['janet@example.com', 'janet.work@example.com'],
      phoneNumbers: [
        {
          type: 'work',
          number: '+15559876543',
        },
      ],
      privacySettings: {
        marketingEmailsEnabled: false,
        twoFactorEnabled: true,
      },
    };

    const updated = await service.update(created.id, update);
    expect(updated.firstName).toBe('Janet');
    expect(updated.emails[0]).toBe('janet@example.com');
    expect(updated.privacySettings.marketingEmailsEnabled).toBe(false);
  });

  it('removes a customer record', async () => {
    const created = await service.create(baseCustomer);
    await service.remove(created.id);
    await expect(service.findOne(created.id)).rejects.toThrow('not found');
  });
});
