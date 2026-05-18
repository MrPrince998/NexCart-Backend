import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ProductCategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'electronics' })
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  parentCategoryId?: string;
}
