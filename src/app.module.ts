import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './core/config/env.schema';
import { RateLimiterMiddleware } from './core/middleware/rate-limiter.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  PermissionGuard,
  RolesGuard,
} from './core/guards/index.guard';
import { ProductsModule } from './modules/products/products.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';

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

    AuthModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    ProductsModule,
    ProductCategoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*'); // Apply global middleware if needed
  }
}
