/**
 * # App: Customer Registration
 * # Package: api.config
 * # File: jest.config.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: Jest configuration for unit tests.
 * # Description: Configures ts-jest for executing unit tests across the NestJS API workspace.
 */
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage-api',
  collectCoverageFrom: ['src/**/*.(t|j)s', '!src/main.ts'],
};

export default config;
