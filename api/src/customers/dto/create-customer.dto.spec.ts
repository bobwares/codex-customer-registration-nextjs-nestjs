/**
 * App: Customer Registration
 * Package: api/src/customers/dto
 * File: create-customer.dto.spec.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: (test suite)
 * Description: Validation tests confirming the CreateCustomerDto enforces
 *              required properties and formats.
 */
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

describe('CreateCustomerDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      id: '9ff5dd9b-2e83-4fdf-9ff0-960693ef89a4',
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: ['ada@example.com'],
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when emails are missing', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      id: '9ff5dd9b-2e83-4fdf-9ff0-960693ef89a4',
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: [],
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'emails')).toBe(true);
  });
});
