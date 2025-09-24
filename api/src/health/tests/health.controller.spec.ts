/**
 * App: Customer Registration
 * Package: api/src/health/tests
 * File: health.controller.spec.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-24T03:07:00Z
 * Exports: none
 * Description: Unit tests for the HealthController endpoints ensuring health responses are returned.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('GET /health returns status ok', () => {
    const res = controller.health();
    expect(res.status).toBe('ok');
    expect(res.service).toBe('backend');
  });

  it('GET /health/live returns ok', () => {
    expect(controller.liveness()).toEqual({ status: 'ok' });
  });

  it('GET /health/ready returns ok', () => {
    expect(controller.readiness()).toEqual({ status: 'ok' });
  });
});
