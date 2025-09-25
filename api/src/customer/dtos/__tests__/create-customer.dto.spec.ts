/**
 * App: Customer Registration
 * Package: api
 * File: create-customer.dto.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (tests)
 * Description: Ensures CreateCustomerDto validation rejects invalid payloads.
 */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerDto } from '../create-customer.dto';

describe('CreateCustomerDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      firstName: 'Jane',
      lastName: 'Doe',
      emails: ['jane.doe@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15555550123' }],
      address: {
        line1: '123 Market St',
        city: 'Austin',
        state: 'TX',
        postalCode: '73301',
        country: 'US',
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects missing required fields', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      firstName: '',
      emails: [],
      phoneNumbers: [],
      privacySettings: {},
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
