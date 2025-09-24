/**
 * App: Customer Registration
 * Package: api
 * File: customers.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-24T22:07:12Z
 * Exports: (tests)
 * Description: E2E-style tests verifying HTTP routes for customer CRUD operations.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CustomerController } from '../src/customer/customer.controller';
import { CustomerService, CustomerResponse } from '../src/customer/customer.service';
import { CreateCustomerDto } from '../src/customer/dtos/create-customer.dto';
import { UpdateCustomerDto } from '../src/customer/dtos/update-customer.dto';

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

describe('Customer routes (e2e)', () => {
  let app: INestApplication;
  const service: Partial<jest.Mocked<CustomerService>> = {
    create: jest.fn().mockResolvedValue(mockCustomer),
    findAll: jest.fn().mockResolvedValue([mockCustomer]),
    findOne: jest.fn().mockResolvedValue(mockCustomer),
    update: jest.fn().mockResolvedValue(mockCustomer),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [{ provide: CustomerService, useValue: service }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /customers', async () => {
    const payload = mockCustomer as unknown as CreateCustomerDto;
    await request(app.getHttpServer()).post('/customers').send(payload).expect(201, mockCustomer);
  });

  it('GET /customers', async () => {
    await request(app.getHttpServer()).get('/customers').expect(200, [mockCustomer]);
  });

  it('GET /customers/:id', async () => {
    await request(app.getHttpServer())
      .get(`/customers/${mockCustomer.id}`)
      .expect(200, mockCustomer);
  });

  it('PUT /customers/:id', async () => {
    const payload: UpdateCustomerDto = { firstName: 'Updated' };
    await request(app.getHttpServer())
      .put(`/customers/${mockCustomer.id}`)
      .send(payload)
      .expect(200, mockCustomer);
  });

  it('DELETE /customers/:id', async () => {
    await request(app.getHttpServer()).delete(`/customers/${mockCustomer.id}`).expect(200);
  });
});
