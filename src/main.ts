import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@/core/filters/http-exception.filter';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getAppConfig } from '@/core/config/app.config';
import { loadEnvVariables } from '@/core/config/load-env';
import { EnvVariables } from '@/core/config/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment variables and app configuration
  const configService = app.get(ConfigService<EnvVariables>);
  const env = loadEnvVariables(configService);
  const appConfig = getAppConfig(env);

  // Apply Helmet for security headers
  app.use(helmet(appConfig.security.helmet));

  // Enable CORS with whitelist origin and credentials support
  app.enableCors({
    origin: appConfig.cors.origin,
    credentials: appConfig.cors.credentials,
    methods: appConfig.cors.methods,
    allowedHeaders: appConfig.cors.allowedHeaders,
  });

  // Use global exception filter for consistent error handling
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api/v1'); // Set global API prefix

  // Use global validation pipe to validate incoming requests based on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: appConfig.validation.whitelist,
      forbidNonWhitelisted: appConfig.validation.forbidNonWhitelisted,
      transform: appConfig.validation.transform,
      transformOptions: appConfig.validation.transformOptions,
    }),
  );

  // Start the application and listen on the configured port
  const port = configService.get<number>('PORT', { infer: true }) || 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
