import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard error response schema
 */
export class ErrorResponse {
  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Invalid request data',
    description: 'Error message',
  })
  message: string | string[];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Error type',
    required: false,
  })
  error?: string;

  @ApiProperty({
    example: 'INVALID_INPUT',
    description: 'Error code for programmatic handling',
    required: false,
  })
  code?: string;

  @ApiProperty({
    example: '2024-05-14T10:30:00Z',
    description: 'ISO timestamp of error',
    required: false,
  })
  timestamp?: string;

  @ApiProperty({
    example: '/api/v1/auth/sign-up',
    description: 'Request path',
    required: false,
  })
  path?: string;
}

/**
 * Validation error response schema
 */
export class ValidationErrorResponse extends ErrorResponse {
  @ApiProperty({
    example: [
      {
        field: 'email',
        message: 'email must be an email',
      },
      {
        field: 'password',
        message: 'password must be at least 8 characters',
      },
    ],
    description: 'Array of validation errors',
    required: false,
  })
  errors?: Array<{
    field: string;
    message: string;
  }>;
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
  error: string = 'Unauthorized';
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
  error: string = 'Forbidden';
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
  error: string = 'Not Found';
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
  error: string = 'Internal Server Error';
}
