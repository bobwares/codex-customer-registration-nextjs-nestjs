/**
 * App: Customer Registration
 * Package: ui
 * File: jest.config.ts
 * Version: 0.1.1
 * Turns: [1]
 * Author: ChatGPT
 * Date: 2025-09-18T16:44:28Z
 * Exports: config
 * Description: Jest configuration targeting Next.js React components with ts-jest preset.
 */
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json', diagnostics: false }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.js',
  },
};

export default config;
