/**
 * App: Customer Registration
 * Package: api/src/customer
 * File: customer.controller.spec.ts
 * Version: 0.1.0
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Description: Validates controller delegates operations to customer service.
 */
import { Test } from '@nestjs/testing';

import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerDto } from './dto/customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: jest.Mocked<CustomerService>;

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<CustomerService>;

    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [{ provide: CustomerService, useValue: service }],
    }).compile();

    controller = moduleRef.get(CustomerController);
  });

  it('creates customers', async () => {
    const dto = { id: '1', firstName: 'Test', lastName: 'User', emails: ['test@example.com'], privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true } } as CreateCustomerDto;
    const expected = { id: '1' } as CustomerDto;
    service.create.mockResolvedValue(expected);

    await expect(controller.create(dto)).resolves.toEqual(expected);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates customers', async () => {
    const dto = { firstName: 'Jane' } as UpdateCustomerDto;
    const expected = { id: '1', firstName: 'Jane' } as CustomerDto;
    service.update.mockResolvedValue(expected);

    await expect(controller.update('1', dto)).resolves.toEqual(expected);
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });
});
