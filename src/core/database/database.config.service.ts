import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getDatabaseConfig } from '../config/database.config';
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

    return getDatabaseConfig(databaseUrl, nodeEnv);
  }
}
