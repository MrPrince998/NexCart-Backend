import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './env.schema';

/**
 * Load all environment variables from ConfigService
 * Fetches each variable individually since ConfigService doesn't support bulk retrieval
 */
export function loadEnvVariables(
  configService: ConfigService<EnvVariables>,
): EnvVariables {
  return {
    NODE_ENV: configService.get('NODE_ENV') || 'development',
    PORT: configService.get('PORT') || 3000,
    FRONTEND_URL: configService.get('FRONTEND_URL')!,
    DATABASE_URL: configService.get('DATABASE_URL')!,
    REDIS_URL: configService.get('REDIS_URL'),
    UPSTASH_REDIS_REST_URL: configService.get('UPSTASH_REDIS_REST_URL'),
    UPSTASH_REDIS_REST_TOKEN: configService.get('UPSTASH_REDIS_REST_TOKEN'),
    JWT_SECRET: configService.get('JWT_SECRET')!,
    JWT_EXPIRATION: configService.get('JWT_EXPIRATION') || '7d',
    RESEND_API_KEY: configService.get('RESEND_API_KEY')!,
    RESEND_FROM_EMAIL: configService.get('RESEND_FROM_EMAIL')!,
    RESEND_FROM_NAME: configService.get('RESEND_FROM_NAME') || 'NexCart',
    CLOUDINARY_CLOUD_NAME: configService.get('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: configService.get('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: configService.get('CLOUDINARY_API_SECRET'),
    PAYMENT_GATEWAY: configService.get('PAYMENT_GATEWAY'),
    PAYMENT_API_KEY: configService.get('PAYMENT_API_KEY'),
    PAYMENT_API_SECRET: configService.get('PAYMENT_API_SECRET'),
    RATE_LIMIT_WINDOW_MS: configService.get('RATE_LIMIT_WINDOW_MS') || 60000,
    RATE_LIMIT_MAX_REQUESTS:
      configService.get('RATE_LIMIT_MAX_REQUESTS') || 100,
    SESSION_SECRET: configService.get('SESSION_SECRET'),
    SOCKET_NAMESPACE: configService.get('SOCKET_NAMESPACE') || '/',
    SOCKET_CORS_ORIGIN: configService.get('SOCKET_CORS_ORIGIN'),
    LOG_LEVEL: configService.get('LOG_LEVEL') || 'info',
    GOOGLE_CLIENT_ID: configService.get('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: configService.get('GOOGLE_CLIENT_SECRET'),
    BETTER_AUTH_SECRET: configService.get('BETTER_AUTH_SECRET')!,
    BETTER_AUTH_URL: configService.get('BETTER_AUTH_URL')!,
  };
}
