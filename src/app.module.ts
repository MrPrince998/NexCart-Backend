import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './core/config/env.schema';
import { RateLimiterMiddleware } from './core/middleware/rate-limiter.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: false, // Show all validation errors instead of stopping at the first one
        allowUnknown: true, // allow environment variables that are not defined in the schema
      },
    }),

    // Authentication Module
    AuthModule,

    // Database Module
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*'); // Apply global middleware if needed
  }
}
