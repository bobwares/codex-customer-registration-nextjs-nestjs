/**
 * App: Customer Registration
 * Package: api/test
 * File: customers.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:04:10Z
 * Exports: none
 * Description: End-to-end tests exercising the customer CRUD API and OpenAPI document exposure using SuperTest.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../src/app.module';
import { CustomerEntity } from '../src/customer/entities/customer.entity';
import { configureSwagger } from '../src/common/swagger/swagger.config';

describe('Customer API (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<CustomerEntity>;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.LOG_FORMAT = 'json';
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const configService = moduleRef.get(ConfigService);
    app = moduleRef.createNestApplication();
    configureSwagger(app, configService);
    await app.init();
    repository = app.get(getRepositoryToken(CustomerEntity));
  });

  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('performs CRUD operations on /customers', async () => {
    const createPayload = {
      firstName: 'Sarah',
      lastName: 'Connor',
      emails: ['sarah@example.com'],
      phoneNumbers: [
        {
          type: 'mobile',
          number: '+15550000001',
        },
      ],
      address: {
        line1: '42 Skyline Dr',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'US',
      },
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: false,
      },
    };

    const createResponse = await request(app.getHttpServer()).post('/customers').send(createPayload).expect(201);
    const customerId = createResponse.body.id;
    expect(customerId).toBeDefined();

    const listResponse = await request(app.getHttpServer()).get('/customers').expect(200);
    expect(listResponse.body).toHaveLength(1);

    await request(app.getHttpServer())
      .put(`/customers/${customerId}`)
      .send({
        firstName: 'Sara',
        emails: ['sara@example.com'],
        phoneNumbers: [
          {
            type: 'home',
            number: '+15550000002',
          },
        ],
        privacySettings: {
          marketingEmailsEnabled: false,
          twoFactorEnabled: true,
        },
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.firstName).toBe('Sara');
        expect(body.emails[0]).toBe('sara@example.com');
      });

    await request(app.getHttpServer()).delete(`/customers/${customerId}`).expect(204);
    await request(app.getHttpServer()).get(`/customers/${customerId}`).expect(404);
  });

  it('exposes OpenAPI document', async () => {
    const response = await request(app.getHttpServer()).get('/api/openapi.json');
    expect(response.status).toBe(200);
    expect(response.body.paths['/customers']).toBeDefined();
    expect(response.body.info.title).toContain('Customer Registration');
  });
});
