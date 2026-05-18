import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, IsUUID, Min } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  @ApiProperty({ example: 'Electronics' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Phones, laptops, headphones and accessories' })
  description?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiPropertyOptional({ example: 'https://example.com/electronics.jpg' })
  image?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  parentCategoryId?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 10 })
  sortOrder?: number;
}
