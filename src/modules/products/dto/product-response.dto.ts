import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@/common/enums';

export class CategoryResponseDto {
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  id!: string;

  @ApiProperty({ example: 'Electronics' })
  name!: string;

  @ApiProperty({ example: 'electronics' })
  slug!: string;
}

export class ProductResponseDto {
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  id!: string;

  @ApiProperty({ example: 'Wireless Headphones' })
  name!: string;

  @ApiProperty({ example: 'wireless-headphones' })
  slug!: string;

  @ApiProperty({
    example: 'High-quality wireless headphones with noise cancellation',
  })
  description!: string;

  @ApiProperty({ example: '199.99' })
  price!: string;

  @ApiPropertyOptional({ example: '149.99' })
  discountPrice!: string | null;

  @ApiProperty({ example: 'SKU-ACME-WH001' })
  sku!: string;

  @ApiProperty({ example: 'Acme' })
  brand!: string;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  status!: ProductStatus;

  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  categoryId!: string;

  @ApiPropertyOptional({ type: CategoryResponseDto })
  category?: CategoryResponseDto;

  @ApiPropertyOptional({ example: '4.5' })
  averageRating!: number | null;

  @ApiProperty({ example: 42 })
  reviewCount!: number;

  @ApiProperty({ example: 156 })
  salesCount!: number;

  @ApiProperty({ example: 1200 })
  viewCount!: number;

  @ApiProperty({ example: false })
  isFeatured!: boolean;

  @ApiProperty({ example: '2026-05-13T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-05-16T10:30:00.000Z' })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: null })
  deletedAt!: Date | null;
}
