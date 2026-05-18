import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { enqueueEmailJob } from '@/integrations/mail';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

interface AuthEmailUser {
  email: string;
  name?: string | null;
}

interface ResetPasswordPayload {
  user: AuthEmailUser;
  url: string;
}

interface ChangeEmailPayload {
  user: AuthEmailUser;
  newEmail: string;
  url: string;
}

interface TwoFactorOtpPayload {
  user: AuthEmailUser;
  otp: string;
}

interface AuthHookContext {
  path?: string;
}

export const auth: any = betterAuth({
  appName: 'NexCart',
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: '/api/v1/auth',
  secret: process.env.BETTER_AUTH_SECRET!,
  database: pool,

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }: ResetPasswordPayload) {
      await enqueueEmailJob({
        to: user.email,
        subject: 'Reset your NexCart password',
        template: 'password-reset',
        data: {
          userName: user.name ?? user.email,
          resetLink: url,
        },
      });
    },
  },

  databaseHooks: {
    user: {
      create: {
        async after(user: { email: string; name?: string | null }) {
          const userName = user.name ?? user.email;

          await enqueueEmailJob({
            to: user.email,
            subject: 'Welcome to NexCart',
            template: 'welcome',
            data: {
              userName,
            },
          });

          await enqueueEmailJob({
            to: user.email,
            subject: 'What you can do with NexCart',
            template: 'about-app',
            data: {
              userName,
            },
          });
        },
      },
    },
    session: {
      create: {
        async after(
          session: { userId: string },
          context?: AuthHookContext | null,
        ) {
          if (context?.path?.includes('/sign-up')) return;

          const user = await findAuthUserById(session.userId);
          if (!user) return;

          await enqueueEmailJob({
            to: user.email,
            subject: 'New login to your NexCart account',
            template: 'status-update',
            data: {
              userName: user.name ?? user.email,
              title: 'New login detected',
              message:
                'Your NexCart account was just signed in. If this was not you, please reset your password.',
              actionUrl: `${process.env.FRONTEND_URL}/account/security`,
              actionText: 'Review Security',
            },
          });
        },
      },
    },
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
    changeEmail: {
      enabled: true,
      async sendChangeEmailConfirmation({
        user,
        newEmail,
        url,
      }: ChangeEmailPayload) {
        await enqueueEmailJob({
          to: user.email,
          subject: 'Confirm your NexCart email change',
          template: 'status-update',
          data: {
            userName: user.name ?? user.email,
            title: 'Confirm email change',
            message: `You requested to change your NexCart email to ${newEmail}.`,
            actionUrl: url,
            actionText: 'Confirm Email Change',
          },
        });
      },
    },
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
      otpOptions: {
        async sendOTP({ user, otp }: TwoFactorOtpPayload) {
          await enqueueEmailJob({
            to: user.email,
            subject: 'Your NexCart security code',
            template: 'otp',
            data: {
              userName: user.name ?? user.email,
              otp,
            },
          });
        },
      },
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

async function findAuthUserById(userId: string) {
  try {
    const result = await pool.query<{
      email: string;
      name: string | null;
    }>('select email, name from "user" where id = $1 limit 1', [userId]);

    return result.rows[0] ?? null;
  } catch {
    return null;
  }
}

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
