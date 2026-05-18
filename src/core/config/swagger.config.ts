import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  SuccessResponse,
  SuccessArrayResponse,
  SuccessObjectResponse,
  PaginatedResponse,
  SuccessEmptyResponse,
} from '@/common/schemas/success.response';
import {
  ErrorResponse,
  ValidationErrorResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  ConflictResponse,
  InternalServerErrorResponse,
} from '@/common/schemas/error.response';
import {
  ProductResponseDto,
  CategoryResponseDto,
} from '@/modules/products/dto/product-response.dto';
import {
  CartResponseDto,
  CartSummaryDto,
  CartItemResponseDto,
  CartProductSummaryDto,
  DashboardAnalyticsResponseDto,
  EmptySuccessResponseDto,
  OrderDetailResponseDto,
  OrderItemResponseDto,
  OrderListResponseDto,
  OrderResponseDto,
  SalesSummaryResponseDto,
  WishlistItemResponseDto,
  WishlistResponseDto,
} from '@/common/schemas/commerce.response';

/**
 * Setup Swagger/OpenAPI documentation for the application
 * @param app NestJS application instance
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NexCart API')
    .setDescription(
      'NexCart API Documentation - A comprehensive e-commerce platform API',
    )
    .setVersion('1.0.0')
    .setContact('NexCart Support', 'https://nexcart.com', 'support@nexcart.com')
    .setLicense('UNLICENSED', '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('stores', 'Seller store endpoints')
    .addTag('addresses', 'Customer address endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('brands', 'Brand management endpoints')
    .addTag('product-attributes', 'Product attribute endpoints')
    .addTag('product-variants', 'Product variant endpoints')
    .addTag('product-category', 'Product category endpoints')
    .addTag('tags', 'Product tag endpoints')
    .addTag('images', 'Image management endpoints')
    .addTag('cart', 'Shopping cart endpoints')
    .addTag('wishlist', 'Wishlist endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('coupons', 'Coupon management endpoints')
    .addTag('inventory', 'Inventory management endpoints')
    .addTag('payments', 'Payment processing endpoints')
    .addTag('shipping', 'Shipment management endpoints')
    .addTag('shipping-rates', 'Shipping zone and rate endpoints')
    .addTag('reviews', 'Product review endpoints')
    .addTag('activity', 'User behavior and activity tracking endpoints')
    .addTag('recommendations', 'Recommendation engine endpoints')
    .addTag('returns', 'Return and refund endpoints')
    .addTag('audit-logs', 'Admin audit log endpoints')
    .addTag('admin', 'Admin dashboard and analytics endpoints')
    .addTag('notifications', 'Notification endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      SuccessResponse,
      SuccessArrayResponse,
      SuccessObjectResponse,
      PaginatedResponse,
      SuccessEmptyResponse,
      ErrorResponse,
      ValidationErrorResponse,
      UnauthorizedResponse,
      ForbiddenResponse,
      NotFoundResponse,
      ConflictResponse,
      InternalServerErrorResponse,
      ProductResponseDto,
      CategoryResponseDto,
      CartProductSummaryDto,
      CartItemResponseDto,
      CartSummaryDto,
      CartResponseDto,
      EmptySuccessResponseDto,
      WishlistItemResponseDto,
      WishlistResponseDto,
      OrderItemResponseDto,
      OrderResponseDto,
      OrderDetailResponseDto,
      OrderListResponseDto,
      DashboardAnalyticsResponseDto,
      SalesSummaryResponseDto,
    ],
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showRequestHeaders: true,
      operationsSorter: 'alpha',
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NexCart API Docs',
  });
}
