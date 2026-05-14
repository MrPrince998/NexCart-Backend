import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {
  ErrorResponse,
  ValidationErrorResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
} from '@/common/schemas/error.response';

/**
 * Setup Swagger/OpenAPI documentation for the application
 * @param app NestJS application instance
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NexCart API')
    .setDescription('NexCart API Documentation - A comprehensive e-commerce platform API')
    .setVersion('1.0.0')
    .setContact(
      'NexCart Support',
      'https://nexcart.com',
      'support@nexcart.com',
    )
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
    .addTag('products', 'Product management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('payments', 'Payment processing endpoints')
    .addTag('notifications', 'Notification endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      ErrorResponse,
      ValidationErrorResponse,
      UnauthorizedResponse,
      ForbiddenResponse,
      NotFoundResponse,
      InternalServerErrorResponse,
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
    customCss:
      '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'NexCart API Docs',
  });
}
