import { ProductAttributeType } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductAttributeDto {
  @IsString()
  @ApiProperty({ example: 'Color' })
  name!: string;

  @IsEnum(ProductAttributeType)
  @ApiProperty({ enum: ProductAttributeType, example: ProductAttributeType.COLOR })
  type!: ProductAttributeType;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: ['Black', 'White', 'Blue'] })
  options?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: false })
  isRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isFilterable?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isComparable?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 10 })
  sortOrder?: number;
}

export class UpdateProductAttributeDto extends CreateProductAttributeDto {}

export class SetProductAttributeValueDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '7f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6c' })
  variantId?: string;

  @IsUUID()
  @ApiProperty({ example: '8f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6d' })
  attributeId!: string;

  @IsString()
  @ApiProperty({ example: 'Black' })
  value!: string;
}
