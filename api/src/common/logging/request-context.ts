/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-context.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: Codex Agent
 * Date: 2025-09-27T16:02:17Z
 * Exports: RequestContext, RequestContextStore
 * Description: Wraps AsyncLocalStorage to capture per-request correlation identifiers and timing metadata.
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
