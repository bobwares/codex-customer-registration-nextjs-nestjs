/**
 * App: Customer Registration
 * Package: api
 * File: health.controller.spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-25T06:25:09Z
 * Exports: (tests)
 * Description: Validates that the health controller exposes the expected
 *              payloads for health, liveness, and readiness probes.
 */
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('returns status ok for metadata endpoint', () => {
    const result = controller.health();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('backend');
    expect(result.pid).toBe(process.pid);
  });

  it('returns ok for liveness', () => {
    expect(controller.liveness()).toEqual({ status: 'ok' });
  });

  it('returns ok for readiness', () => {
    expect(controller.readiness()).toEqual({ status: 'ok' });
  });
});
