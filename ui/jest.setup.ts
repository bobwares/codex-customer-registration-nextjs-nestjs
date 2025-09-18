/**
 * # App: Customer Registration
 * # Package: ui.tests
 * # File: jest.setup.ts
 * # Version: 0.1.0
 * # Turns: 1
 * # Author: AI Agent
 * # Date: 2025-09-18T19:33:35Z
 * # Exports: (setup)
 * # Description: Registers custom matchers for DOM assertions.
 */
import '@testing-library/jest-dom';

if (!globalThis.crypto?.randomUUID) {
  const { webcrypto } = require('crypto');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  globalThis.crypto = webcrypto as Crypto;
}
