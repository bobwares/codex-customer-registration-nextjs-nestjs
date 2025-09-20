/**
 * App: Customer Registration
 * Package: api/src/customers
 * File: customers.controller.spec.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: (test suite)
 * Description: Unit tests verifying that the CustomersController delegates to
 *              the service layer and returns expected responses.
 */
import { Test } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, PrivacySettingsDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';

const privacy: PrivacySettingsDto = {
  marketingEmailsEnabled: false,
  twoFactorEnabled: true,
};

const customer: Customer = {
  id: '0f9efdd4-d9e7-4ace-a4d8-7b7f0ed2e16f',
  firstName: 'Grace',
  lastName: 'Hopper',
  emails: ['grace@example.com'],
  privacySettings: privacy,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn().mockResolvedValue(customer),
            findAll: jest.fn().mockResolvedValue([customer]),
            findOne: jest.fn().mockResolvedValue(customer),
            update: jest.fn().mockResolvedValue(customer),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(CustomersController);
    service = moduleRef.get(CustomersService);
  });

  it('creates a customer', async () => {
    const dto: CreateCustomerDto = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      emails: customer.emails,
      privacySettings: privacy,
    };
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('lists customers', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([customer]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('fetches a customer by id', async () => {
    const result = await controller.findOne(customer.id);
    expect(result).toEqual(customer);
    expect(service.findOne).toHaveBeenCalledWith(customer.id);
  });

  it('updates a customer', async () => {
    await controller.update(customer.id, { firstName: 'Ada' });
    expect(service.update).toHaveBeenCalledWith(customer.id, { firstName: 'Ada' });
  });

  it('removes a customer', async () => {
    await controller.remove(customer.id);
    expect(service.remove).toHaveBeenCalledWith(customer.id);
  });
});
