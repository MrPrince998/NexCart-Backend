import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { twoFactor } from 'better-auth/plugins/two-factor';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const auth: any = betterAuth({
  appName: 'NexCart',
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: '/api/v1/auth',
  secret: process.env.BETTER_AUTH_SECRET!,
  database: pool,

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
  },

  // OAuth - Google
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },

  // Session Configuration
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // Refresh every 24 hours
    cookieCache: {
      maxAge: 5 * 60 * 60, // 5 hours in browser
    },
  },

  // User Configuration
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'user',
      },
      isEmailVerified: {
        type: 'boolean',
        defaultValue: false,
      },
    },
  },

  // Account Configuration
  account: {
    accountLinking: {
      enabled: true,
    },
  },

  // Plugins
  plugins: [
    twoFactor({
      issuer: 'NexCart',
    }),
  ],

  // CSRF & Security
  trustedOrigins: [process.env.FRONTEND_URL || ''],

  // Advanced Security
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    disableCSRFCheck: false,
    disableOriginCheck: false,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
