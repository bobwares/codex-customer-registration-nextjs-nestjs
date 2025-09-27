/**
 * # App: Customer Registration API
 * # Package: api.test
 * # File: health.e2e-spec.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-01-01T00:00:00Z
 * # Description: End-to-end tests for the health endpoints verifying responses from /health, /health/live, and
 * #              /health/ready when the Nest application is running.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('/health/live (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('/health/ready (GET) -> 200', async () => {
    const res = await request(app.getHttpServer()).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
