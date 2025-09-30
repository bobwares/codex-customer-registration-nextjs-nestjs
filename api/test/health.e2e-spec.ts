/**
 * # App: Customer Registration API
 * # Package: api/test
 * # File: health.e2e-spec.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: End-to-end tests verifying health endpoints respond with expected payloads.
 * #
 * # Test Suites
 * # - Health E2E: Boots the Nest application and asserts responses for health, liveness, and readiness routes.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

const REQUIRED_ENV = {
  DATABASE_HOST: '127.0.0.1',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'postgres',
  DATABASE_NAME: 'appdb',
};

describe('Health E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    Object.assign(process.env, REQUIRED_ENV);

    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    Object.keys(REQUIRED_ENV).forEach((key) => delete process.env[key]);
  });

  it('/health (GET) -> 200', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('/health/live (GET) -> 200', async () => {
    const response = await request(app.getHttpServer()).get('/health/live');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('/health/ready (GET) -> 200', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
