import { ActivityType } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class TrackActivityDto {
  @IsEnum(ActivityType)
  @ApiProperty({ enum: ActivityType, example: ActivityType.PRODUCT_VIEW })
  type!: ActivityType;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  productId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'anon-session-123' })
  sessionId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'homepage' })
  source?: string;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ example: { query: 'headphones' } })
  metadata?: Record<string, unknown>;
}
