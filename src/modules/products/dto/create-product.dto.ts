import { ProductStatus } from '@/common/enums';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Wireless Headphones', description: 'Product name' })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'High-quality wireless headphones with noise cancellation',
    description: 'Product description',
  })
  description!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @ApiProperty({ example: 199.99, description: 'Product price in USD' })
  price!: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @ApiPropertyOptional({
    example: 149.99,
    description: 'Discounted price when on promotion, nullable',
  })
  discountPrice!: number | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Acme', description: 'Product brand name' })
  brand!: string;

  @IsEnum(ProductStatus)
  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.ACTIVE,
    description: 'Current product status',
  })
  status!: ProductStatus;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b', description: 'Category UUID' })
  categoryId!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false, description: 'Whether the product is featured' })
  isFeatured!: boolean;
}
