import type { BetterAuthOptions } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { allowedTestEmail, sanitizeOAuthName, validOAuthEmail } from '../../lib/auth-policy.ts';
import { authEnvironment } from './environment.ts';
import type { Pool } from 'pg';
import { deliveryState, oauthFlowState } from './delivery.ts';

export function authOptions(pool: Pool): BetterAuthOptions {
  const config = authEnvironment();
  if (!config) throw new Error('Authentication is unavailable');
  const socialProviders: BetterAuthOptions['socialProviders'] = {
    ...(config.oauth.google ? {
      google: {
        clientId: config.oauth.google.clientId,
        clientSecret: config.oauth.google.clientSecret,
      },
    } : {}),
    ...(config.oauth.github ? {
      github: {
        clientId: config.oauth.github.clientId,
        clientSecret: config.oauth.github.clientSecret,
      },
    } : {}),
  };
  return {
    appName: 'CELAHAN', baseURL: config.origin, secret: config.secret, database: pool,
    trustedOrigins: [config.origin],
    logger: { disabled: true }, telemetry: { enabled: false },
    socialProviders,
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'github'],
      },
    },
    emailAndPassword: { enabled: true, minPasswordLength: 15, maxPasswordLength: 128, requireEmailVerification: true, autoSignIn: false, revokeSessionsOnPasswordReset: true },
    session: { expiresIn: 60 * 60 * 8, updateAge: 60 * 30, freshAge: 60 * 10, cookieCache: { enabled: false } },
    advanced: {
      database: { joins: true },
      disableCSRFCheck: false, disableOriginCheck: false,
      ipAddress: { ipAddressHeaders: ['x-celahan-client-ip'] },
      defaultCookieAttributes: { httpOnly: true, sameSite: 'lax', path: '/' },
    },
    user: { additionalFields: {
      // The public auth route filters the response. Server session checks need these fields.
      role: { type: 'string', defaultValue: 'user', input: false },
      accountEnabled: { type: 'boolean', defaultValue: true, input: false },
    } },
    rateLimit: {
      enabled: true, storage: 'database', window: 60, max: 60,
      customRules: {
        '/sign-up/email': { window: 60, max: 5 },
        '/sign-in/email': { window: 60, max: 10 },
        '/sign-in/social': { window: 60, max: 15 },
        '/callback/google': { window: 60, max: 20 },
        '/callback/github': { window: 60, max: 20 },
        '/email-otp/send-verification-otp': { window: 60, max: 5 },
        '/email-otp/verify-email': { window: 60, max: 10 },
        '/email-otp/request-password-reset': { window: 60, max: 5 },
        '/email-otp/reset-password': { window: 60, max: 10 },
      },
    },
    databaseHooks: {
      user: { create: { before: async (user) => {
        const oauthFlow = oauthFlowState.getStore();
        if (oauthFlow) {
          if (!user.emailVerified || !validOAuthEmail(user.email)) return false;
          return {
            data: {
              ...user,
              name: sanitizeOAuthName(user.name, user.email),
              email: user.email.toLowerCase(),
              role: 'user',
              accountEnabled: true,
              image: null,
            },
          };
        }
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
    ],
  };
}
