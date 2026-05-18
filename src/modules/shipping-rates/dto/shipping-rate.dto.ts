import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateShippingZoneDto {
  @IsString()
  @ApiProperty({ example: 'United States' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Domestic shipping zone' })
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['US'] })
  countries!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ example: ['CA', 'NY'] })
  states?: string[];

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class UpdateShippingZoneDto extends CreateShippingZoneDto {}

export class CreateShippingRateDto {
  @IsUUID()
  @ApiProperty({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  zoneId!: string;

  @IsString()
  @ApiProperty({ example: 'Standard Shipping' })
  name!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 9.99 })
  price!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'USD' })
  currency?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 50 })
  minOrderAmount?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ example: true })
  isActive?: boolean;
}

export class UpdateShippingRateDto extends CreateShippingRateDto {}

export class CalculateShippingRatesDto {
  @IsString()
  @ApiProperty({ example: 'US' })
  country!: string;

  @IsString()
  @ApiProperty({ example: 'CA' })
  state!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 125.5 })
  orderAmount!: number;
}
