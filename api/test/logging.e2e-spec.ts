/**
 * # App: Customer Registration API
 * # Package: api/test
 * # File: logging.e2e-spec.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Validates structured logging emits JSON lines with request identifiers and latency metadata.
 * #
 * # Test Suites
 * # - Logging E2E: Captures stdout while exercising a health endpoint and verifies structured log content.
 */
import { INestApplication, LogLevel, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { JsonLogger } from '../src/common/logging/json-logger.service';

const REQUIRED_ENV = {
  DATABASE_HOST: '127.0.0.1',
  DATABASE_USER: 'postgres',
  DATABASE_PASSWORD: 'postgres',
  DATABASE_NAME: 'appdb',
};

const LOG_LEVELS: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];

describe('Logging E2E', () => {
  let app: INestApplication;
  let writeSpy: jest.SpyInstance | undefined;
  let outputs: string[];

  beforeAll(async () => {
    process.env.LOG_FORMAT = 'json';
    process.env.LOG_LEVEL = 'log';
    Object.assign(process.env, REQUIRED_ENV);

    const { AppModule } = await import('../src/app.module');
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const jsonLogger = app.get(JsonLogger);
    jsonLogger.configure(LOG_LEVELS);
    app.useLogger(jsonLogger);
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
    delete process.env.LOG_FORMAT;
    delete process.env.LOG_LEVEL;
    Object.keys(REQUIRED_ENV).forEach((key) => delete process.env[key]);
  });

  beforeEach(() => {
    outputs = [];
    writeSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation((chunk: unknown): boolean => {
        outputs.push(String(chunk));
        return true;
      });
  });

  afterEach(() => {
    if (writeSpy) {
      writeSpy.mockRestore();
      writeSpy = undefined;
    }
  });

  it('emits JSON structured logs containing requestId and responseTimeMs', async () => {
    await request(app.getHttpServer()).get('/health').expect(200);

    const structured = outputs
      .map((line) => line.trim())
      .filter((line) => Boolean(line))
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (error) {
          return undefined;
        }
      })
      .find((entry) => entry?.message === 'request');

    expect(structured).toBeDefined();
    expect(typeof structured!.requestId).toBe('string');
    expect(structured!.requestId.length).toBeGreaterThan(0);
    expect(typeof structured!.responseTimeMs).toBe('number');
    expect(structured!.method).toBe('GET');
    expect(structured!.url).toBe('/health');
  });
});
