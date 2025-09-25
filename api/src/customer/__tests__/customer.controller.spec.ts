/**
 * App: Customer Registration
 * Package: api
 * File: customer.controller.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (tests)
 * Description: Verifies the controller delegates to the service layer and
 *              returns the expected DTOs.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../customer.controller';
import { CustomerService } from '../customer.service';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

const exampleCustomer: CustomerResponseDto = {
  id: '11111111-1111-1111-1111-111111111111',
  firstName: 'Jane',
  middleName: 'Q',
  lastName: 'Doe',
  emails: ['jane.doe@example.com'],
  phoneNumbers: [{ type: 'mobile', number: '+15555550123' }],
  address: {
    line1: '123 Market St',
    city: 'Austin',
    state: 'TX',
    postalCode: '73301',
    country: 'US',
  },
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
};

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([exampleCustomer]),
            findOne: jest.fn().mockResolvedValue(exampleCustomer),
            create: jest.fn().mockResolvedValue(exampleCustomer),
            update: jest.fn().mockResolvedValue(exampleCustomer),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('lists customers', async () => {
    await expect(controller.findAll()).resolves.toEqual([exampleCustomer]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('gets a customer', async () => {
    await expect(controller.findOne(exampleCustomer.id)).resolves.toEqual(exampleCustomer);
    expect(service.findOne).toHaveBeenCalledWith(exampleCustomer.id);
  });

  it('creates a customer', async () => {
    await controller.create({
      firstName: 'Jane',
      lastName: 'Doe',
      emails: ['jane.doe@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15555550123' }],
      address: {
        line1: '123 Market St',
        city: 'Austin',
        state: 'TX',
        postalCode: '73301',
        country: 'US',
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    } as any);
    expect(service.create).toHaveBeenCalled();
  });

  it('updates a customer', async () => {
    await controller.update(exampleCustomer.id, {});
    expect(service.update).toHaveBeenCalledWith(exampleCustomer.id, {});
  });

  it('removes a customer', async () => {
    await controller.remove(exampleCustomer.id);
    expect(service.remove).toHaveBeenCalledWith(exampleCustomer.id);
  });
});
