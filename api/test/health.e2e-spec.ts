/**
 * App: Customer Registration
 * Package: api/test
 * File: health.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: none
 * Description: E2E tests verifying health, liveness, and readiness endpoints respond successfully.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
let AppModule: typeof import('../src/app.module').AppModule;

describe('Health E2E', () => {
  let app: INestApplication;
  const originalEnv = { ...process.env };

  beforeAll(async () => {
    Object.assign(process.env, {
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '5432',
      DATABASE_USER: 'test',
      DATABASE_PASSWORD: 'test',
      DATABASE_NAME: 'testdb',
      DATABASE_SCHEMA: 'public',
      DATABASE_SSL: 'false',
    });
    ({ AppModule } = await import('../src/app.module'));
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = modRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
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
