/**
 * # App: Customer Registration API
 * # Package: api/src/common/logging
 * # File: request-context.ts
 * # Version: 0.1.0
 * # Author: Codex Agent
 * # Date: 2025-09-30T16:46:37+00:00
 * # Description: Provides AsyncLocalStorage utilities for tracking request IDs and timing metadata per request lifecycle.
 * #
 * # Types
 * # - RequestContextStore: Shape of the per-request context containing identifier and start time.
 * #
 * # Constants
 * # - RequestContext: Helper exposing run and get operations for AsyncLocalStorage access.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContextStore = {
  requestId: string;
  startHrTime: [number, number];
};

const storage = new AsyncLocalStorage<RequestContextStore>();

export const RequestContext = {
  run<T>(store: RequestContextStore, callback: () => T): T {
    return storage.run(store, callback);
  },
  get(): RequestContextStore | undefined {
    return storage.getStore();
  },
};
