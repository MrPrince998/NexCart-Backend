import { PaymentMethod } from '@/common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jane Doe' })
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '+1 555 123 4567' })
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123 Market Street' })
  line1!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Apt 4B' })
  line2?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'San Francisco' })
  city!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'CA' })
  state!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '94103' })
  postalCode!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'US' })
  country!: string;
}

export class CheckoutDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @ApiProperty({ type: ShippingAddressDto })
  shippingAddress!: ShippingAddressDto;

  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH_ON_DELIVERY })
  paymentMethod!: PaymentMethod;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'WELCOME10' })
  couponCode?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: '4f8b2f3e-1d2a-4b9b-a6b5-1c2d3e4f5a6b' })
  shippingRateId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Leave package at the front desk.' })
  notes?: string;
}
