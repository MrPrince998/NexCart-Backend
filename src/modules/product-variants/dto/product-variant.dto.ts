import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NC-WIR-BLK' })
  sku!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Black / Large' })
  name!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 199.99 })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 149.99 })
  discountPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 25 })
  stock?: number;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ example: { color: 'Black', size: 'Large' } })
  options?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class UpdateProductVariantDto extends CreateProductVariantDto {}
