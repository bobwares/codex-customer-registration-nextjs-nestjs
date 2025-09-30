/**
 * # App: Customer Registration API
 * # Package: api/src/customer/dtos
 * # File: create-customer.dto.spec.ts
 * # Version: 0.1.0
 * # Turns: 4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: Unit tests validating CreateCustomerDto transformation and validation constraints using
 * #              class-validator to ensure schema compliance.
 * #
 * # Test Suites
 * # - CreateCustomerDto: Confirms acceptance of valid payloads and rejection of malformed inputs.
 */
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

describe('CreateCustomerDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      id: '8d5b1c5b-4744-45f5-9a65-8eaa0fbecf2a',
      firstName: 'Jane',
      middleName: 'Q',
      lastName: 'Doe',
      emails: ['jane.doe@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15558675309' }],
      address: {
        line1: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'US',
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('flags missing required properties', async () => {
    const dto = plainToInstance(CreateCustomerDto, {
      id: 'invalid',
      firstName: '',
      lastName: '',
      emails: [],
      privacySettings: {},
    });

    const errors = await validate(dto);
    expect(errors).not.toHaveLength(0);
  });
});
