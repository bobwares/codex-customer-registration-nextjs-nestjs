/**
 * # App: Customer Registration
 * # Package: api.tests.e2e
 * # File: test/customers.e2e-spec.ts
 * # Version: 0.1.4
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T20:20:00Z
 * # Exports: (test suite)
 * # Description: Exercises the customer CRUD HTTP endpoints end-to-end with an in-memory database.
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

const customerId = '11111111-2222-4333-8444-555555555555';

const createPayload = {
  id: customerId,
  firstName: 'Clara',
  middleName: 'A',
  lastName: 'Oswald',
  emails: ['clara.oswald@example.com'],
  phoneNumbers: [
    {
      type: 'mobile',
      number: '+15555550010',
    },
  ],
  address: {
    line1: '123 High St',
    city: 'Blackpool',
    state: 'LAN',
    postalCode: 'FY1 1AA',
    country: 'GB',
  },
  privacySettings: {
    marketingEmailsEnabled: true,
    twoFactorEnabled: false,
  },
};

describe('CustomersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const { AppModule } = await import('../src/app.module');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, reads, updates, and deletes a customer', async () => {
    const createResponse = await request(app.getHttpServer()).post('/api/customers').send(createPayload);
    expect(createResponse.status).toBe(201);
    expect(createResponse.body.customerId).toEqual(customerId);

    const listResponse = await request(app.getHttpServer()).get('/api/customers');
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    expect(listResponse.body).toHaveLength(1);

    const readResponse = await request(app.getHttpServer()).get(`/api/customers/${customerId}`);
    expect(readResponse.status).toBe(200);
    expect(readResponse.body.firstName).toEqual('Clara');

    const updateResponse = await request(app.getHttpServer())
      .put(`/api/customers/${customerId}`)
      .send({
        firstName: 'Clara Updated',
        emails: ['clara.updated@example.com'],
        privacySettings: {
          marketingEmailsEnabled: false,
          twoFactorEnabled: true,
        },
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.firstName).toEqual('Clara Updated');
    expect(updateResponse.body.emails[0].email).toEqual('clara.updated@example.com');

    const deleteResponse = await request(app.getHttpServer()).delete(`/api/customers/${customerId}`);
    expect(deleteResponse.status).toBe(200);

    const missingResponse = await request(app.getHttpServer()).get(`/api/customers/${customerId}`);
    expect(missingResponse.status).toBe(404);
  });
});
