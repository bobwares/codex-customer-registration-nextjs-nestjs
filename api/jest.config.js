/**
 * App: Customer Registration
 * Package: api
 * File: jest.config.js
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-26T02:55:41Z
 * Exports: Jest configuration object
 * Description: Configures Jest for unit testing the NestJS API with TypeScript support and common test discovery patterns.
 */
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
