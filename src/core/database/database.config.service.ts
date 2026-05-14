import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvVariables } from '../config/env.schema';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService<EnvVariables>) {}

  getTypeOrmConfig(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    return {
      type: 'postgres',
      url: databaseUrl,
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/migrations/*.js'],
      synchronize: nodeEnv === 'development',
      logging: nodeEnv === 'development',
      logger: 'advanced-console',
      ssl:
        nodeEnv === 'production'
          ? {
              rejectUnauthorized: false,
            }
          : false,
      extra: {
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      },
    };
  }
}
