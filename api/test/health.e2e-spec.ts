/**
 * # App: Customer Registration API
 * # Package: api/test
 * # File: health.e2e-spec.ts
 * # Version: 0.2.0
 * # Turns: 1,4
 * # Author: Codex Agent
 * # Date: 2025-09-30T18:10:00Z
 * # Description: End-to-end tests verifying health endpoints respond with expected payloads.
 * #
 * # Test Suites
 * # - Health E2E: Boots the Nest application and asserts responses for health, liveness, and readiness routes.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HealthModule } from '../src/health/health.module';

describe('Health E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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
