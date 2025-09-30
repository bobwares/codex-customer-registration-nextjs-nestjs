/**
 * # App: Customer Registration API
 * # Package: api/src/health/tests
 * # File: health.controller.spec.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Unit tests verifying the HealthController probes return the expected payloads.
 * #
 * # Test Suites
 * # - HealthController: Ensures metadata, liveness, and readiness handlers respond correctly.
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
    const response = controller.health();
    expect(response.status).toBe('ok');
    expect(response.service).toBe('backend');
  });

  it('GET /health/live returns ok', () => {
    expect(controller.liveness()).toEqual({ status: 'ok' });
  });

  it('GET /health/ready returns ok', () => {
    expect(controller.readiness()).toEqual({ status: 'ok' });
  });
});
