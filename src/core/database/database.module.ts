import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
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

        return {
          type: 'postgres',
          url: databaseUrl,
          entities: ['dist/**/*.entity.js'],
          migrations: ['dist/migrations/*.js'],
          autoLoadEntities: true,
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
      },
    }),
  ],
  controllers: [],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseModule {}
