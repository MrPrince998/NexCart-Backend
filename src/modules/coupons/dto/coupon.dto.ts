import { CouponStatus, DiscountType } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'WELCOME10' })
  code!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Welcome discount' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: '10% off first order' })
  description?: string;

  @IsEnum(DiscountType)
  @ApiProperty({ enum: DiscountType, example: DiscountType.PERCENTAGE })
  discountType!: DiscountType;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 10 })
  discountValue!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 100 })
  minimumOrderAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional({ example: 50 })
  maximumDiscountAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1000 })
  usageLimit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({ example: 1 })
  usageLimitPerUser?: number;

  @IsOptional()
  @IsEnum(CouponStatus)
  @ApiPropertyOptional({ enum: CouponStatus })
  status?: CouponStatus;
}

export class UpdateCouponDto extends CreateCouponDto {}
