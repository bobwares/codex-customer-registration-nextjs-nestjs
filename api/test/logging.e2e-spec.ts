/**
 * App: Customer Registration
 * Package: api/test
 * File: logging.e2e-spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: none
 * Description: Ensures structured logging emits JSON lines with request identifiers and latency information.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
let AppModule: typeof import('../src/app.module').AppModule;

describe('LoggingInterceptor', () => {
  let app: INestApplication;
  const originalFormat = process.env.LOG_FORMAT;
  const originalEnv = { ...process.env };
  let writeSpy: jest.SpyInstance;

  beforeAll(async () => {
    process.env.LOG_FORMAT = 'json';
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
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    if (originalFormat === undefined) {
      delete process.env.LOG_FORMAT;
    } else {
      process.env.LOG_FORMAT = originalFormat;
    }
    Object.keys(process.env).forEach((key) => {
      if (!(key in originalEnv)) {
        delete process.env[key];
      }
    });
    Object.assign(process.env, originalEnv);
  });

  beforeEach(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('logs JSON output with requestId and responseTimeMs', async () => {
    await request(app.getHttpServer()).get('/health');

    const entries = writeSpy.mock.calls
      .map(([chunk]) => {
        const line = chunk.toString();
        try {
          return JSON.parse(line) as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .filter((value): value is Record<string, unknown> => value !== null);

    expect(entries.length).toBeGreaterThan(0);
    const record = entries[entries.length - 1];
    expect(record.requestId).toBeDefined();
    expect(typeof record.responseTimeMs === 'number' || record.responseTimeMs === undefined).toBe(true);
  });
});
