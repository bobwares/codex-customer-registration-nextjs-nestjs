/**
 * App: Customer Registration
 * Package: api.customers.tests
 * File: customer.controller.test.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Unit tests verifying controller mapping logic for responses produced by the
 *              customer service.
 */
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerModule } from './customer.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { CustomerEmail } from './customer-email.entity';
import { CustomerPhoneNumber } from './customer-phone-number.entity';
import { PostalAddress } from './postal-address.entity';
import { PrivacySettings } from './privacy-settings.entity';

describe('CustomerController', () => {
  let controller: CustomerController;

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

    controller = moduleRef.get(CustomerController);
  });

  it('creates and returns a normalized response', async () => {
    const response = await controller.create({
      firstName: 'Grace',
      lastName: 'Hopper',
      emails: ['grace@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+14155550102' }],
      address: {
        line1: '11 Navy St',
        city: 'Arlington',
        state: 'VA',
        postalCode: '22202',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: false,
        twoFactorEnabled: true,
      },
    });

    expect(response.id).toBeDefined();
    expect(response.emails).toEqual(['grace@example.com']);
    expect(response.address?.city).toBe('Arlington');
  });
});
