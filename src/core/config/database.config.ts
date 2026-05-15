import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * Get database configuration based on environment
 * @param databaseUrl PostgreSQL connection URL
 * @param nodeEnv Node environment (development, production, staging)
 * @returns TypeORM configuration object
 */
export function getDatabaseConfig(
  databaseUrl: string,
  nodeEnv: string = 'development',
): TypeOrmModuleOptions {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

 return {
   type: 'postgres',
   url: databaseUrl,
   autoLoadEntities: true,
   entities: ['dist/**/*.entity.js'],
   migrations: ['dist/migrations/*.js'],

   synchronize: nodeEnv === 'development',
   logging: nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],

   extra: {
     max: 5,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 30000,
     statement_timeout: 30000,
   },

   dropSchema: false,
   migrationsRun: false,
   installExtensions: true,
 };
}

/**
 * Database configuration presets for different environments
 */
export const databaseConfigPresets = {
  development: {
    type: 'postgres' as const,
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'nexcart_dev',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
    logging: true,
  },
  staging: {
    type: 'postgres' as const,
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: ['error', 'warn'],
    ssl: {
      rejectUnauthorized: false,
    },
  },
  production: {
    type: 'postgres' as const,
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    logging: ['error'],
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      max: 50,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },
};
