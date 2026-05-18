import * as Joi from 'joi';

export const envSchema = Joi.object({
  // Application Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'staging')
    .default('development'),

  PORT: Joi.number().port().default(3000),

  // Frontend & CORS
  FRONTEND_URL: Joi.string().uri().required().messages({
    'string.uri': 'FRONTEND_URL must be a valid URI',
    'any.required': 'FRONTEND_URL is required for CORS configuration',
  }),

  // Database Configuration
  DATABASE_URL: Joi.string().required().messages({
    'any.required': 'DATABASE_URL is required for database connection',
  }),

  // Redis TCP configuration for BullMQ, cache, and Socket.IO.
  // Use redis:// for local/plain Redis or rediss:// for TLS Redis providers.
  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .optional()
    .messages({
      'string.uri':
        'REDIS_URL must be a Redis TCP URL, e.g. redis://localhost:6379 or rediss://default:password@host:6379. Upstash REST URLs belong in UPSTASH_REDIS_REST_URL.',
      'string.uriCustomScheme':
        'REDIS_URL must be a Redis TCP URL, e.g. redis://localhost:6379 or rediss://default:password@host:6379. Upstash REST URLs belong in UPSTASH_REDIS_REST_URL.',
    }),

  // Optional Upstash REST configuration for @upstash/redis.
  UPSTASH_REDIS_REST_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .optional(),
  UPSTASH_REDIS_REST_TOKEN: Joi.string().optional(),

  // JWT Authentication
  JWT_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'JWT_SECRET must be at least 32 characters long',
    'any.required': 'JWT_SECRET is required for authentication',
  }),

  JWT_EXPIRATION: Joi.string().default('7d'),

  // Resend Email Service
  RESEND_API_KEY: Joi.string().required().messages({
    'any.required': 'RESEND_API_KEY is required for email service',
  }),

  RESEND_FROM_EMAIL: Joi.string().email().required().messages({
    'string.email': 'RESEND_FROM_EMAIL must be a valid email',
    'any.required': 'RESEND_FROM_EMAIL is required',
  }),

  RESEND_FROM_NAME: Joi.string().default('NexCart'),

  // Cloudinary Configuration (Optional)
  CLOUDINARY_CLOUD_NAME: Joi.string().optional(),
  CLOUDINARY_API_KEY: Joi.string().optional(),
  CLOUDINARY_API_SECRET: Joi.string().optional(),

  // Payment Gateway (Optional)
  PAYMENT_GATEWAY: Joi.string()
    .valid('stripe', 'paypal', 'razorpay')
    .optional(),
  PAYMENT_API_KEY: Joi.string().optional(),
  PAYMENT_API_SECRET: Joi.string().optional(),
  STRIPE_SECRET_KEY: Joi.string().optional(),
  STRIPE_WEBHOOK_SECRET: Joi.string().optional(),
  STRIPE_SUCCESS_URL: Joi.string().uri().optional(),
  STRIPE_CANCEL_URL: Joi.string().uri().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(60000), // 1 minute
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // Session Configuration
  SESSION_SECRET: Joi.string().min(32).optional().messages({
    'string.min': 'SESSION_SECRET must be at least 32 characters long',
  }),

  // Socket.IO Configuration (Optional)
  SOCKET_NAMESPACE: Joi.string().default('/'),
  SOCKET_CORS_ORIGIN: Joi.string().uri().optional(),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('debug', 'info', 'warn', 'error')
    .default('info'),

  // Google OAuth
  GOOGLE_CLIENT_ID: Joi.string().optional(),
  GOOGLE_CLIENT_SECRET: Joi.string().optional(),

  // Better Auth Configuration
  BETTER_AUTH_SECRET: Joi.string().min(32).required().messages({
    'string.min': 'BETTER_AUTH_SECRET must be at least 32 characters long',
    'any.required': 'BETTER_AUTH_SECRET is required for authentication',
  }),

  BETTER_AUTH_URL: Joi.string().uri().required().messages({
    'string.uri': 'BETTER_AUTH_URL must be a valid URI',
    'any.required': 'BETTER_AUTH_URL is required for authentication',
  }),
});

export interface EnvVariables {
  NODE_ENV: 'development' | 'production' | 'staging';
  PORT: number;
  FRONTEND_URL: string;
  DATABASE_URL: string;
  REDIS_URL?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  RESEND_FROM_NAME: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  PAYMENT_GATEWAY?: 'stripe' | 'paypal' | 'razorpay';
  PAYMENT_API_KEY?: string;
  PAYMENT_API_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_SUCCESS_URL?: string;
  STRIPE_CANCEL_URL?: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  SESSION_SECRET?: string;
  SOCKET_NAMESPACE: string;
  SOCKET_CORS_ORIGIN?: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
}
