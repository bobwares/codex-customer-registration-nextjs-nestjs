/**
 * App: Customer Registration
 * Package: api
 * File: create-customer.dto.test.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: (tests)
 * Description: Validates the CreateCustomerDto schema using class-validator.
 */
import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCustomerDto } from '../create-customer.dto';

const basePayload = {
  id: '11111111-1111-4111-8111-111111111111',
  firstName: 'Alice',
  lastName: 'Smith',
  address: {
    line1: '100 Market St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'US',
  },
  privacySettings: {
    marketingEmailsEnabled: true,
    twoFactorEnabled: false,
  },
  emails: ['alice@example.com'],
  phoneNumbers: [{ type: 'mobile', number: '+15555550101' }],
};

describe('CreateCustomerDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateCustomerDto, basePayload);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects missing required fields', async () => {
    const dto = plainToInstance(CreateCustomerDto, { ...basePayload, id: undefined });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'id')).toBe(true);
  });
});
