/**
 * App: Customer Registration
 * Package: api/test
 * File: health.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T14:26:25Z
 * Exports: (tests)
 * Description: Exercises the health endpoints over HTTP to verify service metadata and probe responses.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

describe('Health E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DATABASE_HOST = process.env.DATABASE_HOST ?? '127.0.0.1';
    process.env.DATABASE_USER = process.env.DATABASE_USER ?? 'postgres';
    process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD ?? 'postgres';
    process.env.DATABASE_NAME = process.env.DATABASE_NAME ?? 'appdb';
    process.env.DATABASE_SCHEMA = process.env.DATABASE_SCHEMA ?? 'public';
    process.env.DATABASE_PORT = process.env.DATABASE_PORT ?? '5432';
    process.env.DATABASE_SSL = process.env.DATABASE_SSL ?? 'false';

    const { AppModule } = await import('../src/app.module');

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
    expect(res.body.service).toBe('backend');
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
