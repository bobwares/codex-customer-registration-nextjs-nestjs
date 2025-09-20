/**
 * App: Customer Registration
 * Package: api/test
 * File: customers.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 2
 * Author: Codex Agent
 * Date: 2025-09-20T04:22:15Z
 * Exports: (test suite)
 * Description: End-to-end tests exercising the customer CRUD REST endpoints
 *              with an in-memory SQLite database.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import request from 'supertest';

process.env.DATABASE_TYPE = 'sqlite';
process.env.DATABASE_PATH = ':memory:';

describe('Customer CRUD (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const { AppModule } = await import('../src/app.module');
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('performs full CRUD lifecycle', async () => {
    const id = randomUUID();
    const payload = {
      id,
      firstName: 'Ada',
      lastName: 'Lovelace',
      emails: ['ada@example.com'],
      privacySettings: {
        marketingEmailsEnabled: true,
        twoFactorEnabled: true,
      },
    };

    await request(app.getHttpServer()).post('/customers').send(payload).expect(201);

    const listResponse = await request(app.getHttpServer()).get('/customers').expect(200);
    expect(listResponse.body).toHaveLength(1);

    const getResponse = await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .expect(200);
    expect(getResponse.body.firstName).toEqual('Ada');

    await request(app.getHttpServer())
      .put(`/customers/${id}`)
      .send({ firstName: 'Grace' })
      .expect(200);

    const updatedResponse = await request(app.getHttpServer())
      .get(`/customers/${id}`)
      .expect(200);
    expect(updatedResponse.body.firstName).toEqual('Grace');

    await request(app.getHttpServer()).delete(`/customers/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/customers/${id}`).expect(404);
  });
});
