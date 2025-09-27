/**
 * App: Customer Registration
 * Package: api/test
 * File: health.e2e-spec.ts
 * Version: 0.1.3
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:08:37Z
 * Exports: (test suite)
 * Description: Exercises the health endpoints via HTTP to ensure the application responds with expected payloads.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

type AppModuleType = typeof import('../src/app.module').AppModule;

const ensureEnv = (key: string, value: string) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
};

ensureEnv('DATABASE_HOST', '127.0.0.1');
ensureEnv('DATABASE_PORT', '5432');
ensureEnv('DATABASE_USER', 'postgres');
ensureEnv('DATABASE_PASSWORD', 'postgres');
ensureEnv('DATABASE_NAME', 'appdb');
ensureEnv('DATABASE_SCHEMA', 'public');
ensureEnv('DATABASE_SSL', 'false');
ensureEnv('APP_NAME', 'backend');
ensureEnv('NODE_ENV', 'test');
ensureEnv('PORT', '3000');

describe('Health E2E', () => {
  let app: INestApplication;
  let AppModuleClass: AppModuleType;

  beforeAll(async () => {
    ({ AppModule: AppModuleClass } = await import('../src/app.module'));

    const moduleRef = await Test.createTestingModule({
      imports: [AppModuleClass],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/health (GET) returns metadata', async () => {
    const response = await request(app.getHttpServer()).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('/health/live (GET) returns ok', async () => {
    const response = await request(app.getHttpServer()).get('/health/live');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('/health/ready (GET) returns ok', async () => {
    const response = await request(app.getHttpServer()).get('/health/ready');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
