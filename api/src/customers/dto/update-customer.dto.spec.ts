/**
 * App: Customer Registration
 * Package: api/src/customers/dto
 * File: update-customer.dto.spec.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: (test suite)
 * Description: Validation tests confirming the UpdateCustomerDto treats all
 *              fields as optional while maintaining formatting requirements.
 */
import { validate } from 'class-validator';
import { UpdateCustomerDto } from './update-customer.dto';

describe('UpdateCustomerDto', () => {
  it('allows partial updates', async () => {
    const dto = new UpdateCustomerDto();
    Object.assign(dto, {
      firstName: 'Ada',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid email formats', async () => {
    const dto = new UpdateCustomerDto();
    Object.assign(dto, {
      emails: ['not-an-email'],
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'emails')).toBe(true);
  });
});
