import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard error response schema matching HttpExceptionFilter format
 */
export class ErrorResponse {
  @ApiProperty({
    example: false,
    description: 'Whether the request was successful',
  })
  success!: boolean;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Human-readable error title',
  })
  title!: string;

  @ApiProperty({
    example: 'Invalid request data',
    description: 'Detailed error message',
  })
  message!: string | string[];

  @ApiProperty({
    example: '2024-05-14T10:30:00.000Z',
    description: 'ISO timestamp of when error occurred',
  })
  timestamp!: string;

  @ApiProperty({
    example: '/api/v1/auth/sign-up',
    description: 'Request path that caused the error',
  })
  path!: string;
}

/**
 * Validation error response schema
 */
export class ValidationErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: 400,
    default: 400,
  })
  statusCode: number = 400;

  @ApiProperty({
    example: 'Bad Request',
    default: 'Bad Request',
  })
  title: string = 'Bad Request';

  @ApiProperty({
    example: [
      'email must be an email',
      'password must be at least 8 characters',
    ],
    description: 'Array of validation error messages',
  })
  message: string[];
}

/**
 * Unauthorized error response schema
 */
export class UnauthorizedResponse extends ErrorResponse {
  @ApiProperty({
    example: 401,
    default: 401,
  })
  statusCode: number = 401;

  @ApiProperty({
    example: 'Unauthorized',
    default: 'Unauthorized',
  })
  title: string = 'Unauthorized';
}

/**
 * Forbidden error response schema
 */
export class ForbiddenResponse extends ErrorResponse {
  @ApiProperty({
    example: 403,
    default: 403,
  })
  statusCode: number = 403;

  @ApiProperty({
    example: 'Forbidden',
    default: 'Forbidden',
  })
  title: string = 'Forbidden';
}

/**
 * Not found error response schema
 */
export class NotFoundResponse extends ErrorResponse {
  @ApiProperty({
    example: 404,
    default: 404,
  })
  statusCode: number = 404;

  @ApiProperty({
    example: 'Not Found',
    default: 'Not Found',
  })
  title: string = 'Not Found';
}

/**
 * Conflict error response schema
 */
export class ConflictResponse extends ErrorResponse {
  @ApiProperty({
    example: 409,
    default: 409,
  })
  statusCode: number = 409;

  @ApiProperty({
    example: 'Conflict',
    default: 'Conflict',
  })
  title: string = 'Conflict';
}

/**
 * Internal server error response schema
 */
export class InternalServerErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: 500,
    default: 500,
  })
  statusCode: number = 500;

  @ApiProperty({
    example: 'Internal Server Error',
    default: 'Internal Server Error',
  })
  title: string = 'Internal Server Error';
}
