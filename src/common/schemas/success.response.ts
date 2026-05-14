import { ApiProperty } from '@nestjs/swagger';

/**
 * Generic success response schema
 */
export class SuccessResponse<T = any> {
  @ApiProperty({
    example: true,
    description: 'Whether the request was successful',
  })
  success!: boolean;

  @ApiProperty({
    example: 200,
    description: 'HTTP status code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Products fetched successfully',
    description: 'Success message',
  })
  message!: string;

  @ApiProperty({
    description: 'Response data payload',
  })
  data!: T;

  @ApiProperty({
    example: '2026-05-13T12:00:00.000Z',
    description: 'ISO timestamp of when response was generated',
  })
  timestamp!: string;
}

/**
 * Success response with array data
 */
export class SuccessArrayResponse<T = any> extends SuccessResponse<T[]> {}

/**
 * Success response with single object
 */
export class SuccessObjectResponse<T = any> extends SuccessResponse<T> {}

/**
 * Success response with pagination
 */
export class PaginatedResponse<T = any> {
  @ApiProperty({
    example: true,
    description: 'Whether the request was successful',
  })
  success!: boolean;

  @ApiProperty({
    example: 200,
    description: 'HTTP status code',
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Products fetched successfully',
    description: 'Success message',
  })
  message!: string;

  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  data!: T[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10,
      nextPage: false,
      prevPage: false,
    },
    description: 'Pagination metadata',
  })
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    nextPage: boolean;
    prevPage: boolean;
  };

  @ApiProperty({
    example: '2026-05-13T12:00:00.000Z',
    description: 'ISO timestamp of when response was generated',
  })
  timestamp!: string;
}

/**
 * Success response with no data (for DELETE, empty operations)
 */
export class SuccessEmptyResponse extends SuccessResponse<null> {}