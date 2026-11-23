import { AsyncLocalStorage } from 'node:async_hooks';
import type { OAuthProvider } from '../../lib/auth-policy.ts';

// Better Auth suppresses delivery callback rejections; retain a request-scoped failure signal.
export const deliveryState = new AsyncLocalStorage<{ failed: boolean }>();

// Marks verified OAuth callback requests so user creation hooks distinguish OAuth from email sign-up.
export const oauthFlowState = new AsyncLocalStorage<{ provider: OAuthProvider }>();
