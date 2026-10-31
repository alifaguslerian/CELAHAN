import { AsyncLocalStorage } from 'node:async_hooks';

// Better Auth suppresses delivery callback rejections; retain a request-scoped failure signal.
export const deliveryState = new AsyncLocalStorage<{ failed: boolean }>();
