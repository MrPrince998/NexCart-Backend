import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { getDatabaseConfig } from './src/core/config/database.config';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV || 'development';

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

let config = getDatabaseConfig(databaseUrl, nodeEnv);

// Override for migrations (use .ts files during development)
if (nodeEnv === 'development') {
  config = {
    ...config,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
    synchronize: false, // Use migrations instead of synchronize
  };
}

export const AppDataSource = new DataSource({
  ...config,
  type: 'postgres',
} as any);
