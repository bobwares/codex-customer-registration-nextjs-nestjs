/**
 * App: Customer Registration
 * Package: api/src/customer/controllers/tests
 * File: customer.controller.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T20:04:09Z
 * Exports: (none)
 * Description: Exercises the customer controller to confirm service mappings, response projections, and error handling.
 */
import { NotFoundException } from '@nestjs/common';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../../services/customer.service';
import type { CreateCustomerInput, UpdateCustomerInput } from '../../services/customer.service';
import { CustomerEntity } from '../../entities/customer.entity';
import { CustomerEmailEntity } from '../../entities/customer_email.entity';
import { CustomerPhoneNumberEntity } from '../../entities/customer_phone_number.entity';
import { PostalAddressEntity } from '../../entities/postal_address.entity';
import { PrivacySettingsEntity } from '../../entities/privacy_settings.entity';

const mockService = (): jest.Mocked<CustomerService> =>
  ({
    createCustomer: jest.fn(),
    findCustomerById: jest.fn(),
    updateCustomer: jest.fn(),
    removeCustomer: jest.fn(),
    listCustomers: jest.fn(),
    listCustomerProfiles: jest.fn(),
  } as unknown as jest.Mocked<CustomerService>);

describe('CustomerController', () => {
  let service: jest.Mocked<CustomerService>;
  let controller: CustomerController;

  beforeEach(() => {
    service = mockService();
    controller = new CustomerController(service);
  });

  it('maps create payloads into the service input contract', async () => {
    const dto = {
      firstName: 'Jane',
      middleName: 'Q.',
      lastName: 'Doe',
      emails: ['jane.doe@example.com', 'jane.work@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15551234567' }],
      address: {
        line1: '123 Market Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94103',
        country: 'US',
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    };
    const entity = buildEntity();
    service.createCustomer.mockResolvedValue(entity);

    const result = await controller.create(dto as never);

    expect(service.createCustomer).toHaveBeenCalledWith(
      expect.objectContaining<CreateCustomerInput>({
        name: 'Jane Doe',
        firstName: 'Jane',
        middleName: 'Q.',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        emails: [
          { email: 'jane.doe@example.com', isPrimary: true },
          { email: 'jane.work@example.com', isPrimary: false },
        ],
        privacySettings: {
          marketingEmailsEnabled: true,
          twoFactorEnabled: false,
        },
      }),
    );
    expect(result.displayName).toBe('Jane Doe');
    expect(result.emails).toContain('jane.work@example.com');
  });

  it('delegates to listCustomers with normalized identifiers', async () => {
    const entity = buildEntity();
    service.listCustomers.mockResolvedValue([entity]);

    const results = await controller.findAll('123, 456 ,  ');

    expect(service.listCustomers).toHaveBeenCalledWith(['123', '456']);
    expect(results).toHaveLength(1);
  });

  it('throws when a customer is not found', async () => {
    service.findCustomerById.mockResolvedValue(null);
    await expect(controller.findOne('missing-id')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('maps update payloads to the service input', async () => {
    const entity = buildEntity();
    service.updateCustomer.mockResolvedValue(entity);

    await controller.update('abc', { privacySettings: null, emails: ['updated@example.com'] } as never);

    expect(service.updateCustomer).toHaveBeenCalledWith('abc', expect.any(Object));
    const [, input] = service.updateCustomer.mock.calls[0];
    expect((input as UpdateCustomerInput).privacySettings).toBeNull();
    expect((input as UpdateCustomerInput).email).toBe('updated@example.com');
    expect((input as UpdateCustomerInput).emails).toEqual([
      { email: 'updated@example.com', isPrimary: true },
    ]);
  });
});

function buildEntity(): CustomerEntity {
  const address = Object.assign(new PostalAddressEntity(), {
    line1: '123 Market Street',
    line2: null,
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'US',
  });
  const privacy = Object.assign(new PrivacySettingsEntity(), {
    marketingEmailsEnabled: true,
    twoFactorEnabled: false,
  });
  const emailPrimary = Object.assign(new CustomerEmailEntity(), {
    email: 'jane.doe@example.com',
    isPrimary: true,
  });
  const emailSecondary = Object.assign(new CustomerEmailEntity(), {
    email: 'jane.work@example.com',
    isPrimary: false,
  });
  const phone = Object.assign(new CustomerPhoneNumberEntity(), {
    type: 'mobile',
    number: '+15551234567',
    extension: null,
  });

  return Object.assign(new CustomerEntity(), {
    customerId: '123',
    name: 'Jane Doe',
    firstName: 'Jane',
    middleName: 'Q.',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    createdAt: new Date('2025-09-25T19:36:06Z'),
    updatedAt: new Date('2025-09-25T19:36:06Z'),
    address,
    privacySettings: privacy,
    emails: [emailPrimary, emailSecondary],
    phoneNumbers: [phone],
  });
}
