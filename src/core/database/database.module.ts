import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '../config/database.config';
import { DatabaseConfigService } from './database.config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');

        if (!databaseUrl) {
          throw new Error('DATABASE_URL environment variable is not set');
        }

        return getDatabaseConfig(databaseUrl, nodeEnv);
      },
    }),
  ],
  controllers: [],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
