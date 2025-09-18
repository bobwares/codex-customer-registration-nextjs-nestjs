/**
 * # App: Customer Registration
 * # Package: api.customers.tests
 * # File: src/customers/customer.controller.spec.ts
 * # Version: 0.1.1
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:47:41Z
 * # Exports: (test suite)
 * # Description: Ensures CustomersController delegates CRUD actions to the service layer.
 */
import { Test, TestingModule } from '@nestjs/testing';

import { CustomersController } from './customer.controller';
import { CustomersService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

const mockCustomer = new Customer();
mockCustomer.customerId = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
mockCustomer.firstName = 'Test';
mockCustomer.lastName = 'User';
mockCustomer.emails = [];
mockCustomer.phoneNumbers = [];

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CustomersController', () => {
  let controller: CustomersController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = moduleRef.get(CustomersController);

    jest.clearAllMocks();
  });

  it('creates a customer', async () => {
    mockService.create.mockResolvedValue(mockCustomer);
    const dto = { id: mockCustomer.customerId } as CreateCustomerDto;
    const result = await controller.create(dto);
    expect(mockService.create).toHaveBeenCalledWith(dto);
    expect(result).toBe(mockCustomer);
  });

  it('returns all customers', async () => {
    mockService.findAll.mockResolvedValue([mockCustomer]);
    const result = await controller.findAll();
    expect(result).toHaveLength(1);
  });

  it('returns single customer', async () => {
    mockService.findOne.mockResolvedValue(mockCustomer);
    const result = await controller.findOne(mockCustomer.customerId);
    expect(mockService.findOne).toHaveBeenCalledWith(mockCustomer.customerId);
    expect(result).toBe(mockCustomer);
  });

  it('updates customer', async () => {
    const dto = { firstName: 'Updated' } as UpdateCustomerDto;
    mockService.update.mockResolvedValue(mockCustomer);
    await controller.update(mockCustomer.customerId, dto);
    expect(mockService.update).toHaveBeenCalledWith(mockCustomer.customerId, dto);
  });

  it('removes customer', async () => {
    mockService.remove.mockResolvedValue(undefined);
    await controller.remove(mockCustomer.customerId);
    expect(mockService.remove).toHaveBeenCalledWith(mockCustomer.customerId);
  });
});
