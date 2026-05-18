import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @ApiProperty({ example: 5 })
  rating!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Great product' })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'The quality is excellent.' })
  comment?: string;
}

export class ModerateReviewDto {
  @IsBoolean()
  @ApiProperty({ example: true })
  isApproved!: boolean;
}
