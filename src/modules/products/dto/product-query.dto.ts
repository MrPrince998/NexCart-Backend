import { ProductStatus } from '@/common/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'headphone',
    description: 'Search query for name, brand, or SKU',
  })
  q?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'audio',
    description: 'Category id or slug to filter products',
  })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Acme', description: 'Filter by brand name' })
  brand?: string;

  @IsOptional()
  @IsEnum(ProductStatus)
  @ApiPropertyOptional({
    enum: ProductStatus,
    description: 'Filter by product status',
  })
  status?: ProductStatus;

  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name'])
  @ApiPropertyOptional({
    example: 'createdAt',
    description: 'Field to sort by',
  })
  sortBy?: 'createdAt' | 'updatedAt' | 'name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  @ApiPropertyOptional({
    example: 'DESC',
    description: 'Sort order (ASC or DESC)',
  })
  sortOrder?: 'ASC' | 'DESC';
}
