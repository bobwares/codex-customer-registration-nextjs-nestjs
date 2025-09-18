/**
 * App: Customer Registration
 * Package: api.e2e
 * File: customers.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: AI Agent
 * Date: 2025-09-18T00:12:49Z
 * Exports: none
 * Description: End-to-end tests exercising the customer REST API using an in-memory database.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { Customer } from '../src/customers/customer.entity';
import { CustomerEmail } from '../src/customers/customer-email.entity';
import { CustomerPhoneNumber } from '../src/customers/customer-phone-number.entity';
import { PostalAddress } from '../src/customers/postal-address.entity';
import { PrivacySettings } from '../src/customers/privacy-settings.entity';

describe('CustomersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Customer, CustomerEmail, CustomerPhoneNumber, PostalAddress, PrivacySettings],
          synchronize: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('performs full CRUD lifecycle', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/customers')
      .send({
        firstName: 'Linus',
        lastName: 'Torvalds',
        emails: ['linus@example.com'],
        phoneNumbers: [{ type: 'mobile', number: '+14155550103' }],
        address: {
          line1: '1 Kernel Way',
          city: 'Helsinki',
          state: 'Uusimaa',
          postalCode: '00100',
          country: 'FI',
        },
        privacySettings: {
          marketingEmailsEnabled: false,
          twoFactorEnabled: true,
        },
      })
      .expect(201);

    const id = createResponse.body.id;
    expect(id).toBeDefined();

    await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.firstName).toBe('Linus');
        expect(res.body.emails).toEqual(['linus@example.com']);
      });

    await request(app.getHttpServer())
      .put(`/customers/${id}`)
      .send({
        firstName: 'Linus',
        lastName: 'Torvalds',
        emails: ['linus@example.com', 'lt@example.com'],
        privacySettings: {
          marketingEmailsEnabled: true,
          twoFactorEnabled: true,
        },
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.emails).toHaveLength(2);
        expect(res.body.privacySettings.marketingEmailsEnabled).toBe(true);
      });

    await request(app.getHttpServer())
      .delete(`/customers/${id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .expect(404);
  });
});
