import 'dotenv/config';
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
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { ImagesModule } from './modules/images/images.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DatabaseSchemaModule } from './modules/database-schema/database-schema.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductVariantsModule } from './modules/product-variants/product-variants.module';
import { ReturnsModule } from './modules/returns/returns.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { TagsModule } from './modules/tags/tags.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ProductAttributesModule } from './modules/product-attributes/product-attributes.module';
import { ShippingRatesModule } from './modules/shipping-rates/shipping-rates.module';
import { AuditModule } from './modules/audit/audit.module';
import { ActivityModule } from './modules/activity/activity.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { StoresModule } from './modules/stores/stores.module';
import { CacheModule } from './integrations/cache';
import { JobsModule } from './jobs/jobs.module';
import { NoopJobsModule } from './jobs/noop-jobs.module';
import { NotificationModule } from './core/adapters/notification.module';
import {
  ProductEventListener,
  UserEventListener,
  CategoryEventListener,
  OrderEventListener,
} from './common/listeners';

const hasRedisTcpUrl = Boolean(process.env.REDIS_URL);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
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
    DatabaseSchemaModule,
    CacheModule,
    hasRedisTcpUrl ? JobsModule : NoopJobsModule,
    NotificationModule,
    UsersModule,
    RolesModule,
    ProductsModule,
    ProductCategoryModule,
    CloudinaryModule,
    ImagesModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    AnalyticsModule,
    AddressesModule,
    CouponsModule,
    InventoryModule,
    NotificationsModule,
    PaymentsModule,
    ProductVariantsModule,
    ReturnsModule,
    ReviewsModule,
    ShippingModule,
    TagsModule,
    BrandsModule,
    ProductAttributesModule,
    ShippingRatesModule,
    AuditModule,
    ActivityModule,
    RecommendationsModule,
    StoresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ProductEventListener,
    UserEventListener,
    CategoryEventListener,
    OrderEventListener,
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
