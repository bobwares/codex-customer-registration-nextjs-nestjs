/**
 * App: Customer Registration
 * Package: api/src/common/logging
 * File: request-context.ts
 * Version: 0.1.0
 * Turns: 1
 * Author: gpt-5-codex
 * Date: 2025-10-27T06:28:15Z
 * Exports: RequestContext, RequestContextStore
 * Description: AsyncLocalStorage wrapper capturing per-request metadata for logging.
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
