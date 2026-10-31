import type { BetterAuthOptions } from 'better-auth';
import { emailOTP, twoFactor } from 'better-auth/plugins';
import { allowedTestEmail } from '../../lib/auth-policy.ts';
import { authEnvironment } from './environment.ts';
import type { Pool } from 'pg';
import { deliveryState } from './delivery.ts';

export function authOptions(pool: Pool): BetterAuthOptions {
  const config = authEnvironment();
  if (!config) throw new Error('Authentication is unavailable');
  return {
    appName: 'CELAHAN', baseURL: config.origin, secret: config.secret, database: pool,
    trustedOrigins: [config.origin],
    logger: { disabled: true }, telemetry: { enabled: false },
    emailAndPassword: { enabled: true, minPasswordLength: 15, maxPasswordLength: 128, requireEmailVerification: true, autoSignIn: false, revokeSessionsOnPasswordReset: true },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 30, freshAge: 60 * 10, cookieCache: { enabled: false } },
    advanced: { disableCSRFCheck: false, disableOriginCheck: false, ipAddress: { ipAddressHeaders: ['x-celahan-client-ip'] }, defaultCookieAttributes: { httpOnly: true, sameSite: 'lax', path: '/' } },
    user: { additionalFields: {
      role: { type: 'string', defaultValue: 'user', input: false, returned: false },
      accountEnabled: { type: 'boolean', defaultValue: true, input: false, returned: false },
    } },
    rateLimit: { enabled: true, storage: 'database', window: 60, max: 60,
      customRules: { '/sign-up/email': { window: 60, max: 5 }, '/sign-in/email': { window: 60, max: 10 } } },
    databaseHooks: {
      user: { create: { before: async (user) => {
        if (!allowedTestEmail(user.email, config.emails)) return false;
        return { data: { ...user, role: 'user', accountEnabled: true, image: null } };
      } } },
      session: { create: { before: async (session) => {
        const result = await pool.query('SELECT "accountEnabled" FROM "user" WHERE id = $1', [session.userId]);
        return result.rows[0]?.accountEnabled === true;
      } } },
    },
    plugins: [
      emailOTP({ disableSignUp: true, sendVerificationOnSignUp: true,
        storeOTP: 'hashed', expiresIn: 300, allowedAttempts: 3,
        async sendVerificationOTP({ email, otp, type }) {
          try {
            if (!allowedTestEmail(email, config.emails) || !['email-verification', 'forget-password'].includes(type)) throw new Error();
            const result = await fetch(config.mailboxURL, {
              method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.mailboxSecret}` },
              body: JSON.stringify({ email, otp, type }), signal: AbortSignal.timeout(3000), redirect: 'error', cache: 'no-store',
            });
            if (!result.ok) throw new Error();
          } catch {
            const state = deliveryState.getStore();
            if (state) state.failed = true;
          }
        },
      }),
      twoFactor({ issuer: 'CELAHAN', totpOptions: { digits: 6, period: 30 }, backupCodeOptions: { storeBackupCodes: 'encrypted' } }),
    ],
  };
}
