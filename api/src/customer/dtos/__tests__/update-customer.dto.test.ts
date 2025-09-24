/**
 * App: Customer Registration
 * Package: api
 * File: update-customer.dto.test.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: (tests)
 * Description: Validates the UpdateCustomerDto schema using class-validator.
 */
import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateCustomerDto } from '../update-customer.dto';

describe('UpdateCustomerDto', () => {
  it('accepts a partial payload', async () => {
    const dto = plainToInstance(UpdateCustomerDto, { firstName: 'Updated' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid phone numbers when provided', async () => {
    const dto = plainToInstance(UpdateCustomerDto, {
      phoneNumbers: [{ type: 'invalid', number: '123' }],
    });
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'phoneNumbers')).toBe(true);
  });
});
