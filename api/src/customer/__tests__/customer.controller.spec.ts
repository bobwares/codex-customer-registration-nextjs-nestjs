/**
 * App: Customer Registration
 * Package: api
 * File: customer.controller.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: (tests)
 * Description: Unit tests verifying controller routes delegate to the customer service.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService, CustomerResponse } from '../customer.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

const mockCustomer: CustomerResponse = {
  id: '11111111-1111-4111-8111-111111111111',
  firstName: 'Alice',
  middleName: null,
  lastName: 'Smith',
  address: {
    line1: '100 Market St',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62701',
    country: 'US',
  },
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
  emails: ['alice@example.com'],
  phoneNumbers: [{ type: 'mobile', number: '+15555550101' }],
};

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCustomer),
            findAll: jest.fn().mockResolvedValue([mockCustomer]),
            findOne: jest.fn().mockResolvedValue(mockCustomer),
            update: jest.fn().mockResolvedValue(mockCustomer),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get(CustomerController);
    service = module.get(CustomerService) as jest.Mocked<CustomerService>;
  });

  it('creates a customer', async () => {
    const dto = { ...(mockCustomer as any) } as CreateCustomerDto;
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockCustomer);
  });

  it('lists customers', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCustomer]);
  });

  it('updates a customer', async () => {
    const dto: UpdateCustomerDto = { firstName: 'Updated' };
    const result = await controller.update(mockCustomer.id, dto);
    expect(service.update).toHaveBeenCalledWith(mockCustomer.id, dto);
    expect(result).toEqual(mockCustomer);
  });

  it('removes a customer', async () => {
    await controller.remove(mockCustomer.id);
    expect(service.remove).toHaveBeenCalledWith(mockCustomer.id);
  });
});
