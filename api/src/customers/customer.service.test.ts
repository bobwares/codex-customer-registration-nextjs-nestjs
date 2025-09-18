/**
 * App: Customer Registration
 * Package: api.customers.tests
 * File: customer.service.test.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Unit tests covering the core customer service operations using an in-memory
 *              SQLite database.
 */
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerModule } from './customer.module';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
          synchronize: true,
        }),
        CustomerModule,
      ],
    }).compile();

    service = moduleRef.get(CustomerService);
  });

  it('creates and retrieves a customer', async () => {
    const dto: CreateCustomerDto = {
      firstName: 'Ada',
      lastName: 'Lovelace',
      middleName: 'Byron',
      emails: ['ada@example.com'],
      phoneNumbers: [
        { type: 'mobile', number: '+14155550100' },
        { type: 'work', number: '+14155550101' },
      ],
      address: {
        line1: '123 Market Street',
        line2: 'Suite 500',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    };

    const created = await service.create(dto);
    expect(created.id).toBeDefined();

    const found = await service.findOne(created.id);
    expect(found.firstName).toBe('Ada');
    expect(found.emails).toHaveLength(1);
    expect(found.phoneNumbers).toHaveLength(2);
  });

  it('updates a customer', async () => {
    const [customer] = await service.findAll();
    const updated = await service.update(customer.id, {
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: ['ada@example.com', 'ada@analyticalengine.com'],
      privacySettings: {
        marketingEmailsEnabled: false,
        twoFactorEnabled: true,
      },
    });

    expect(updated.emails).toHaveLength(2);
    expect(updated.privacySettings?.marketingEmailsEnabled).toBe(false);
  });
});
