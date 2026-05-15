import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from './product-response.dto';

export class ProductListResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Products retrieved successfully' })
  message!: string;

  @ApiProperty({ type: [ProductResponseDto], isArray: true })
  data!: ProductResponseDto[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10,
      nextPage: true,
      prevPage: false,
    },
  })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    nextPage: boolean;
    prevPage: boolean;
  };

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  timestamp!: string;
}

export class ProductDetailResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Product retrieved successfully' })
  message!: string;

  @ApiProperty({ type: ProductResponseDto })
  data!: ProductResponseDto;

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  timestamp!: string;
}

export class ProductCreateResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 201 })
  statusCode!: number;

  @ApiProperty({ example: 'Product created successfully' })
  message!: string;

  @ApiProperty({ type: ProductResponseDto })
  data!: ProductResponseDto;

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  timestamp!: string;
}

export class ProductDeleteResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 200 })
  statusCode!: number;

  @ApiProperty({ example: 'Product deleted successfully' })
  message!: string;

  @ApiProperty({ example: null })
  data!: null;

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  timestamp!: string;
}
