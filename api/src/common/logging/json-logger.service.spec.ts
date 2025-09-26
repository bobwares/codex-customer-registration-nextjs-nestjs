/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: json-logger.service.spec.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:03:52Z
 * Exports: none
 * Description: Unit tests confirming the JsonLogger emits structured payloads enriched with request context metadata.
 */
import { JsonLogger } from './json-logger.service';
import { RequestContext } from './request-context';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.LOG_FORMAT = 'json';
    logger = new JsonLogger();
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('serializes log entries with request context', () => {
    RequestContext.run({ requestId: 'req-123', startTime: process.hrtime.bigint() }, () => {
      logger.log({ message: 'request', method: 'GET', url: '/health', statusCode: 200 }, 'HTTP');
    });

    expect(writeSpy).toHaveBeenCalled();
    const payload = JSON.parse(writeSpy.mock.calls[0][0].toString());
    expect(payload.requestId).toBe('req-123');
    expect(payload.meta.method).toBe('GET');
    expect(payload.meta.statusCode).toBe(200);
  });
});
