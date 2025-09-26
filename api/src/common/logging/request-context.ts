/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-context.ts
 * Version: 0.1.0
 * Turns: 4
 * Author: Codex Agent
 * Date: 2025-09-26T05:01:06Z
 * Exports: RequestContext, RequestContextStore
 * Description: AsyncLocalStorage-backed helper for storing per-request identifiers and timers.
 */
import { AsyncLocalStorage } from 'node:async_hooks';

export type RequestContextStore = {
  requestId: string;
  startTime: bigint;
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
