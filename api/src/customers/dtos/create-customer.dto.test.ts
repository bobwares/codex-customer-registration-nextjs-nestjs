/**
 * App: Customer Registration
 * Package: api.customers.tests
 * File: create-customer.dto.test.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: Ensures validation rules on the CreateCustomerDto enforce the shared schema
 *              requirements.
 */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateCustomerDto } from './create-customer.dto';

describe('CreateCustomerDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: ['ada@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+14155550100' }],
      address: {
        line1: '123 Market Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects missing required fields', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      lastName: '',
      emails: [],
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
